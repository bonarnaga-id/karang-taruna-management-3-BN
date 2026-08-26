import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { organizationStructure } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, hasPermission } from "@/lib/auth-middleware";
import { createAuditLog } from "@/lib/audit";

// GET - Struktur organisasi (publik)
export async function GET() {
  try {
    const data = await db
      .select()
      .from(organizationStructure)
      .orderBy(organizationStructure.level, organizationStructure.order);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Get structure error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST - Tambah posisi struktur
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_structure")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const body = await request.json();
    
    if (!body.name || !body.position) {
      return NextResponse.json({ error: "Nama dan posisi wajib diisi" }, { status: 400 });
    }

    const [newStructure] = await db.insert(organizationStructure).values({
      id: crypto.randomUUID(),
      name: body.name,
      position: body.position,
      parentId: body.parentId || null,
      level: body.level || 1,
      memberId: body.memberId || null,
      description: body.description || "",
      order: body.order || 0
    }).returning();

    await createAuditLog(auth.user.userId, "CREATE_STRUCTURE", "organization_structure", newStructure.id);

    return NextResponse.json({ message: "Posisi berhasil ditambahkan", data: newStructure }, { status: 201 });
  } catch (error) {
    console.error("Create structure error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PUT - Update struktur
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_structure")) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID wajib diisi" }, { status: 400 });
    }

    const [updated] = await db.update(organizationStructure)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(organizationStructure.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    await createAuditLog(auth.user.userId, "UPDATE_STRUCTURE", "organization_structure", id);

    return NextResponse.json({ message: "Data berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("Update structure error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
