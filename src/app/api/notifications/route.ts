import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { notifications as notifTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "@/lib/auth-middleware";

// GET notifikasi user
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!auth.user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const data = await db
      .select()
      .from(notifTable)
      .where(eq(notifTable.userId, auth.user.userId))
      .orderBy(desc(notifTable.createdAt))
      .limit(50);

    // Hitung yang belum dibaca
    const unreadCount = data.filter(n => !n.isRead).length;

    return NextResponse.json({ data, unreadCount });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// Tandai semua sudah dibaca (mark one or all as read)
export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;
    
    if (!auth.user) {
      return NextResponse.json({ error: "Tidak terautentikasi" }, { status: 401 });
    }

    const body = await request.json();
    const notificationId = body.notificationId;

    if (notificationId) {
      // Tandai satu notifikasi sebagai sudah dibaca
      await db.update(notifTable)
        .set({ isRead: true })
        .where(eq(notifTable.id, notificationId));
    } else {
      // Tandai semua sebagai sudah dibaca
      await db.update(notifTable)
        .set({ isRead: true })
        .where(eq(notifTable.userId, auth.user.userId));
    }

    return NextResponse.json({ message: "Notifikasi diperbarui" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memperbarui notifikasi" }, { status: 500 });
  }
}
