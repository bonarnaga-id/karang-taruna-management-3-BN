import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, hasPermission } from "@/lib/auth-middleware";
import { activitySchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    const { id } = await params;
    
    const [activity] = await db.select()
      .from(activities)
      .where(eq(activities.id, id));

    if (!activity) {
      return NextResponse.json(
        { error: "Kegiatan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: activity });
  } catch (error) {
    console.error("Get activity error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data kegiatan" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_activities")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk mengubah kegiatan" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    const [existingActivity] = await db.select()
      .from(activities)
      .where(eq(activities.id, id));

    if (!existingActivity) {
      return NextResponse.json(
        { error: "Kegiatan tidak ditemukan" },
        { status: 404 }
      );
    }

    const validatedData = activitySchema.partial().safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const [updatedActivity] = await db.update(activities)
      .set({
        ...validatedData.data,
        updatedAt: new Date()
      })
      .where(eq(activities.id, id))
      .returning();

    await createAuditLog(
      auth.user.userId,
      "UPDATE_ACTIVITY",
      "activities",
      id,
      validatedData.data
    );

    return NextResponse.json({
      message: "Kegiatan berhasil diperbarui",
      data: updatedActivity
    });
  } catch (error) {
    console.error("Update activity error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui kegiatan" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_activities")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk menghapus kegiatan" },
        { status: 403 }
      );
    }

    const { id } = await params;
    
    const [activity] = await db.select()
      .from(activities)
      .where(eq(activities.id, id));

    if (!activity) {
      return NextResponse.json(
        { error: "Kegiatan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(activities).where(eq(activities.id, id));

    await createAuditLog(
      auth.user.userId,
      "DELETE_ACTIVITY",
      "activities",
      id,
      { title: activity.title }
    );

    return NextResponse.json({ message: "Kegiatan berhasil dihapus" });
  } catch (error) {
    console.error("Delete activity error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus kegiatan" },
      { status: 500 }
    );
  }
}
