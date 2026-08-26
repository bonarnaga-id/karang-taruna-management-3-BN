import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, members } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validasi input
    const validatedData = loginSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = validatedData.data;

    // Cari user di database
    const [user] = await db.select().from(users).where(eq(users.email, email));
    
    if (!user) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Cek apakah user aktif
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Akun Anda tidak aktif. Hubungi administrator." },
        { status: 403 }
      );
    }

    // Verifikasi password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Email atau password salah" },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    // Set cookie
    await setAuthCookie(token);

    // Update last login
    await db.update(users).set({ 
      lastLogin: new Date(),
      updatedAt: new Date()
    }).where(eq(users.id, user.id));

    // Ambil data anggota jika ada
    let memberData = null;
    if (user.memberId) {
      const [member] = await db.select().from(members).where(eq(members.id, user.memberId));
      memberData = member;
    }

    // Audit log
    await createAuditLog(user.id, "LOGIN", "users", user.id, { email });

    return NextResponse.json({
      message: "Login berhasil",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        member: memberData
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
