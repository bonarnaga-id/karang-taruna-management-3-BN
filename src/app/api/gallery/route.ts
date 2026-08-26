import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { gallery as galleryTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, hasPermission } from "@/lib/auth-middleware";
import { createAuditLog } from "@/lib/audit";

// GET - Galeri (publik)
export async function GET() {
  try {
    const data = await db
      .select()
      .from(galleryTable)
      .orderBy(desc(galleryTable.createdAt));

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Get gallery error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST - Tambah foto galeri
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_documents")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const body = await request.json();
    
    if (!body.title || !body.imageUrl) {
      return NextResponse.json({ error: "Judul dan gambar wajib diisi" }, { status: 400 });
    }

    const [newItem] = await db.insert(galleryTable).values({
      id: crypto.randomUUID(),
      title: body.title,
      imageUrl: body.imageUrl,
      description: body.description || "",
      activityId: body.activityId || null,
      uploadedBy: auth.user.userId
    }).returning();

    await createAuditLog(auth.user.userId, "CREATE_GALLERY", "gallery", newItem.id);

    return NextResponse.json({ message: "Foto berhasil ditambahkan", data: newItem }, { status: 201 });
  } catch (error) {
    console.error("Create gallery error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
