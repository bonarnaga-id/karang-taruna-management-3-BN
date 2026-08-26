import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { members } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, hasPermission } from "@/lib/auth-middleware";
import { memberSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Detail anggota
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    const { id } = await params;
    
    const [member] = await db.select()
      .from(members)
      .where(eq(members.id, id));

    if (!member) {
      return NextResponse.json(
        { error: "Anggota tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: member });
  } catch (error) {
    console.error("Get member error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data anggota" },
      { status: 500 }
    );
  }
}

// PUT - Update anggota
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_members")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk mengubah data anggota" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    // Cek apakah anggota ada
    const [existingMember] = await db.select()
      .from(members)
      .where(eq(members.id, id));

    if (!existingMember) {
      return NextResponse.json(
        { error: "Anggota tidak ditemukan" },
        { status: 404 }
      );
    }

    const validatedData = memberSchema.partial().safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const [updatedMember] = await db.update(members)
      .set({
        ...validatedData.data,
        updatedAt: new Date()
      })
      .where(eq(members.id, id))
      .returning();

    await createAuditLog(
      auth.user.userId,
      "UPDATE_MEMBER",
      "members",
      id,
      validatedData.data
    );

    return NextResponse.json({
      message: "Data anggota berhasil diperbarui",
      data: updatedMember
    });
  } catch (error) {
    console.error("Update member error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui data anggota" },
      { status: 500 }
    );
  }
}

// DELETE - Hapus anggota
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_members")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk menghapus anggota" },
        { status: 403 }
      );
    }

    const { id } = await params;
    
    const [member] = await db.select()
      .from(members)
      .where(eq(members.id, id));

    if (!member) {
      return NextResponse.json(
        { error: "Anggota tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(members).where(eq(members.id, id));

    await createAuditLog(
      auth.user.userId,
      "DELETE_MEMBER",
      "members",
      id,
      { fullName: member.fullName }
    );

    return NextResponse.json({ message: "Anggota berhasil dihapus" });
  } catch (error) {
    console.error("Delete member error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus anggota" },
      { status: 500 }
    );
  }
}
