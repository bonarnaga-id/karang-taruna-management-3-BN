import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { members } from "@/db/schema";
import { eq, like, or, desc, asc, ilike, count, and } from "drizzle-orm";
import { requireAuth, hasPermission } from "@/lib/auth-middleware";
import { memberSchema } from "@/lib/validations";
import { generateMemberNumber } from "@/lib/utils";
import { createAuditLog } from "@/lib/audit";

// GET - Daftar anggota
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "view_members")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk melihat data anggota" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    // Build conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          ilike(members.fullName, `%${search}%`),
          ilike(members.memberNumber, `%${search}%`)
        )
      );
    }
    
    if (status) {
      conditions.push(eq(members.status, status as any));
    }

    // Count total
    const whereClause = conditions.length > 0 
      ? (conditions.length === 1 ? conditions[0] : and(...conditions))
      : undefined;

    const [countResult] = await db
      .select({ count: count() })
      .from(members)
      .where(whereClause);
    
    const total = countResult?.count || 0;

    // Get data with pagination
    const data = await db
      .select()
      .from(members)
      .where(whereClause)
      .orderBy(desc(members.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    await createAuditLog(auth.user.userId, "VIEW_MEMBERS", "members", undefined, { 
      page, limit, search 
    });

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Get members error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data anggota" },
      { status: 500 }
    );
  }
}

// POST - Tambah anggota baru
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_members")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk menambah anggota" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    const validatedData = memberSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const memberData = validatedData.data;
    const memberNumber = memberData.memberNumber || generateMemberNumber();

    // Cek nomor anggota duplikat
    const [existingMember] = await db.select()
      .from(members)
      .where(eq(members.memberNumber, memberNumber));
    
    if (existingMember) {
      return NextResponse.json(
        { error: "Nomor anggota sudah digunakan" },
        { status: 409 }
      );
    }

    const [newMember] = await db.insert(members).values({
      id: crypto.randomUUID(),
      memberNumber,
      fullName: memberData.fullName,
      birthPlace: memberData.birthPlace,
      birthDate: memberData.birthDate,
      gender: memberData.gender,
      address: memberData.address,
      phone: memberData.phone,
      email: memberData.email || null,
      education: memberData.education,
      occupation: memberData.occupation,
      skills: memberData.skills,
      joinDate: memberData.joinDate,
      status: memberData.status
    }).returning();

    await createAuditLog(
      auth.user.userId, 
      "CREATE_MEMBER", 
      "members", 
      newMember.id, 
      { memberNumber, fullName: newMember.fullName }
    );

    return NextResponse.json({
      message: "Anggota berhasil ditambahkan",
      data: newMember
    }, { status: 201 });

  } catch (error) {
    console.error("Create member error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan anggota" },
      { status: 500 }
    );
  }
}
