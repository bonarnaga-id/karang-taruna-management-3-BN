import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { activities } from "@/db/schema";
import { eq, ilike, count, and, desc } from "drizzle-orm";
import { requireAuth, hasPermission } from "@/lib/auth-middleware";
import { activitySchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

// GET - Daftar kegiatan
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    
    // Untuk endpoint publik (tanpa auth), kita biarkan akses
    const isPublic = !auth.user;
    
    if (!isPublic && !hasPermission(auth.user.role, "view_activities")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const conditions = [];
    if (search) {
      conditions.push(ilike(activities.title, `%${search}%`));
    }
    if (status) {
      conditions.push(eq(activities.status, status as any));
    }

    const whereClause = conditions.length > 0 
      ? (conditions.length === 1 ? conditions[0] : and(...conditions))
      : undefined;

    const [countResult] = await db
      .select({ count: count() })
      .from(activities)
      .where(whereClause);
    
    const total = countResult?.count || 0;

    const data = await db
      .select()
      .from(activities)
      .where(whereClause)
      .orderBy(desc(activities.startDate))
      .limit(limit)
      .offset((page - 1) * limit);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error("Get activities error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data kegiatan" },
      { status: 500 }
    );
  }
}

// POST - Tambah kegiatan baru
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_activities")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk menambah kegiatan" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    const validatedData = activitySchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const [newActivity] = await db.insert(activities).values({
      id: crypto.randomUUID(),
      title: validatedData.data.title,
      description: validatedData.data.description,
      location: validatedData.data.location,
      startDate: validatedData.data.startDate,
      endDate: validatedData.data.endDate,
      responsiblePerson: validatedData.data.responsiblePerson,
      budget: validatedData.data.budget,
      status: validatedData.data.status
    }).returning();

    await createAuditLog(
      auth.user.userId,
      "CREATE_ACTIVITY",
      "activities",
      newActivity.id,
      { title: newActivity.title }
    );

    return NextResponse.json({
      message: "Kegiatan berhasil ditambahkan",
      data: newActivity
    }, { status: 201 });
  } catch (error) {
    console.error("Create activity error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan kegiatan" },
      { status: 500 }
    );
  }
}
