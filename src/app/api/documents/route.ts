import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { documents as docTable } from "@/db/schema";
import { eq, desc, count, and, ilike, sql } from "drizzle-orm";
import { requireAuth, hasPermission } from "@/lib/auth-middleware";
import { createAuditLog } from "@/lib/audit";

// GET - Daftar dokumen
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "view_documents") && !hasPermission(auth.user.role, "manage_documents")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const conditions = [];
    if (type) conditions.push(sql`${docTable.type} = ${type}`);
    if (search) conditions.push(ilike(docTable.title, `%${search}%`));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [countResult] = await db.select({ count: count() }).from(docTable).where(whereClause);
    const total = countResult?.count || 0;

    const data = await db
      .select()
      .from(docTable)
      .where(whereClause)
      .orderBy(desc(docTable.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error("Get documents error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST - Upload dokumen
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_documents")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const body = await request.json();
    
    if (!body.title || !body.fileUrl || !body.type) {
      return NextResponse.json({ error: "Judul, file URL, dan tipe dokumen wajib diisi" }, { status: 400 });
    }

    const [newDoc] = await db.insert(docTable).values({
      id: crypto.randomUUID(),
      title: body.title,
      type: body.type,
      fileUrl: body.fileUrl,
      fileSize: body.fileSize,
      fileType: body.fileType,
      description: body.description || "",
      activityId: body.activityId || null,
      uploadedBy: auth.user.userId
    }).returning();

    await createAuditLog(auth.user.userId, "UPLOAD_DOCUMENT", "documents", newDoc.id);

    return NextResponse.json({ message: "Dokumen berhasil diupload", data: newDoc }, { status: 201 });
  } catch (error) {
    console.error("Upload document error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
