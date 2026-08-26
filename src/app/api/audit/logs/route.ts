import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { eq, ilike, or, count, and, desc } from "drizzle-orm";
import { requireAuth, isAdmin } from "@/lib/auth-middleware";

// GET Audit Log (hanya admin/super_admin)
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!isAdmin(auth.user.role)) {
      return NextResponse.json({ error: "Hanya administrator yang dapat melihat audit log" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const action = searchParams.get("action");
    const entity = searchParams.get("entity");

    const conditions = [];
    if (action) conditions.push(ilike(auditLogs.action, `%${action}%`));
    if (entity) conditions.push(eq(auditLogs.entity, entity));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await db.select({ count: count() }).from(auditLogs).where(whereClause);
    const total = countResult?.count || 0;

    const data = await db
      .select()
      .from(auditLogs)
      .where(whereClause)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    return NextResponse.json({
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error("Get audit logs error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
