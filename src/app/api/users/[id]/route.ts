import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, isAdmin } from "@/lib/auth-middleware";
import { hashPassword } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!isAdmin(auth.user.role) && auth.user.userId !== (await params).id) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const { id } = await params;
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Jangan kirim password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ data: userWithoutPassword });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    const { id } = await params;
    
    // Admin bisa edit siapapun, user biasa hanya bisa edit diri sendiri
    if (!isAdmin(auth.user.role) && auth.user.userId !== id) {
      return NextResponse.json({ error: "Anda hanya bisa mengubah data Anda sendiri" }, { status: 403 });
    }

    const body = await request.json();
    const [existingUser] = await db.select().from(users).where(eq(users.id, id));

    if (!existingUser) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Jika ada perubahan password
    const updateData: Record<string, unknown> = {
      ...body,
      updatedAt: new Date()
    };

    if (body.password && body.password.length >= 6) {
      updateData.password = await hashPassword(body.password);
    }
    
    delete updateData.password; // Remove plain password

    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        updatedAt: users.updatedAt
      });

    await createAuditLog(auth.user.userId, "UPDATE_USER", "users", id);

    return NextResponse.json({ message: "Data user berhasil diperbarui", data: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (auth.user.role !== "super_admin") {
      return NextResponse.json({ error: "Hanya Super Admin yang dapat menghapus user" }, { status: 403 });
    }

    const { id } = await params;
    
    // Tidak boleh hapus diri sendiri
    if (id === auth.user.userId) {
      return NextResponse.json({ error: "Tidak dapat menghapus akun Anda sendiri" }, { status: 400 });
    }

    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    await db.delete(users).where(eq(users.id, id));
    
    await createAuditLog(auth.user.userId, "DELETE_USER", "users", id);

    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
