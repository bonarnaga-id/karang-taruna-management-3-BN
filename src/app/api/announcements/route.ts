import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { announcements as annTable } from "@/db/schema";
import { eq, ilike, or, count, and, desc } from "drizzle-orm";
import { requireAuth, hasPermission } from "@/lib/auth-middleware";
import { announcementSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

// GET - Daftar pengumuman (publik hanya yang published)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    const isPublic = !auth.user;
    
    if (!isPublic && !hasPermission(auth.user.role, "view_announcements")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Public only see published
    let whereClause;
    if (isPublic) {
      whereClause = eq(annTable.isPublished, true);
    }

    if (search) {
      const searchCondition = or(
        ilike(annTable.title, `%${search}%`),
        ilike(annTable.content, `%${search}%`)
      );
      whereClause = whereClause ? and(whereClause, searchCondition) : searchCondition;
    }

    const [countResult] = await db
      .select({ count: count() })
      .from(annTable)
      .where(whereClause);

    const total = countResult?.count || 0;

    const data = await db
      .select()
      .from(annTable)
      .where(whereClause)
      .orderBy(desc(annTable.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error("Get announcements error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST - Tambah pengumuman
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_announcements")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = announcementSchema.safeParse(body);
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const [newAnn] = await db.insert(annTable).values({
      id: crypto.randomUUID(),
      title: validatedData.data.title,
      content: validatedData.data.content,
      type: validatedData.data.type || "pengumuman",
      isPublished: validatedData.data.isPublished,
      publishedAt: validatedData.data.isPublished ? new Date() : null,
      authorId: auth.user.userId
    }).returning();

    await createAuditLog(auth.user.userId, "CREATE_ANNOUNCEMENT", "announcements", newAnn.id);

    return NextResponse.json({ message: "Pengumuman berhasil ditambahkan", data: newAnn }, { status: 201 });
  } catch (error) {
    console.error("Create announcement error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
