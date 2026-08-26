import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, like, or, desc, count, ilike, and, sql } from "drizzle-orm";
import { requireAuth, hasPermission, isAdmin } from "@/lib/auth-middleware";
import { userSchema } from "@/lib/validations";
import { hashPassword } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

// GET - Daftar user (hanya admin)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!isAdmin(auth.user.role)) {
      return NextResponse.json({ error: "Hanya administrator yang dapat mengakses data pengguna" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role");

    const conditions = [];
    if (search) {
      conditions.push(or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)));
    }
    if (role) {
      conditions.push(sql`${users.role} = ${role}`);
    }

    const whereClause = conditions.length > 0 
      ? (conditions.length === 1 ? conditions[0] : and(...conditions))
      : undefined;

    const [countResult] = await db.select({ count: count() }).from(users).where(whereClause);
    const total = countResult?.count || 0;

    const data = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        isActive: users.isActive,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt
      })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST - Buat user baru (Super Admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (auth.user.role !== "super_admin") {
      return NextResponse.json({ error: "Hanya Super Admin yang dapat membuat akun baru" }, { status: 403 });
    }

    const body = await request.json();
    
    // Validasi
    const validatedData = userSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: "Validasi gagal", details: validatedData.error.flatten() }, { status: 400 });
    }

    if (!body.password || body.password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
    }

    // Cek email duplikat
    const [existingUser] = await db.select().from(users).where(eq(users.email, validatedData.data.email));
    if (existingUser) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
    }

    const hashedPassword = await hashPassword(body.password);

    const [newUser] = await db.insert(users).values({
      id: crypto.randomUUID(),
      email: validatedData.data.email,
      password: hashedPassword,
      name: validatedData.data.name,
      role: validatedData.data.role,
      isActive: validatedData.data.isActive,
      memberId: validatedData.data.memberId || null
    }).returning({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt
    });

    await createAuditLog(auth.user.userId, "CREATE_USER", "users", newUser.id, { email: newUser.email });

    return NextResponse.json({ message: "User berhasil dibuat", data: newUser }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
