import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { financialTransactions } from "@/db/schema";
import { eq, ilike, or, count, and, desc, sql } from "drizzle-orm";
import { requireAuth, hasPermission, canApproveFinance } from "@/lib/auth-middleware";
import { financialTransactionSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

// GET - Daftar transaksi keuangan
export async function GET(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "view_finances") && !hasPermission(auth.user.role, "manage_finances")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk melihat data keuangan" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type"); // pemasukan / pengeluaran
    const status = searchParams.get("status");
    const search = searchParams.get("search") || "";

    const conditions = [];
    if (type) {
      conditions.push(eq(financialTransactions.type, type as any));
    }
    if (status) {
      conditions.push(eq(financialTransactions.status, status as any));
    }
    if (search) {
      conditions.push(
        or(
          ilike(financialTransactions.category, `%${search}%`),
          ilike(financialTransactions.description || "", `%${search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 
      ? (conditions.length === 1 ? conditions[0] : and(...conditions))
      : undefined;

    // Count total
    const [countResult] = await db
      .select({ count: count() })
      .from(financialTransactions)
      .where(whereClause);
    
    const total = countResult?.count || 0;

    const data = await db
      .select()
      .from(financialTransactions)
      .where(whereClause)
      .orderBy(desc(financialTransactions.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    // Calculate totals for summary
    const [incomeResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(${financialTransactions.amount} AS NUMERIC)), 0)` })
      .from(financialTransactions)
      .where(and(
        eq(financialTransactions.type, "pemasukan"),
        eq(financialTransactions.status, "disetujui")
      ));

    const [expenseResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(CAST(${financialTransactions.amount} AS NUMERIC)), 0)` })
      .from(financialTransactions)
      .where(and(
        eq(financialTransactions.type, "pengeluaran"),
        eq(financialTransactions.status, "disetujui")
      ));

    return NextResponse.json({
      data,
      summary: {
        totalPemasukan: incomeResult?.total || 0,
        totalPengeluaran: expenseResult?.total || 0,
        saldo: (incomeResult?.total || 0) - (expenseResult?.total || 0)
      },
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error("Get finance error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil data keuangan" },
      { status: 500 }
    );
  }
}

// POST - Tambah transaksi baru
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_finances")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk menambah transaksi" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    const validatedData = financialTransactionSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const [newTransaction] = await db.insert(financialTransactions).values({
      id: crypto.randomUUID(),
      date: validatedData.data.date,
      type: validatedData.data.type,
      category: validatedData.data.category,
      amount: validatedData.data.amount,
      source: validatedData.data.source,
      description: validatedData.data.description,
      status: validatedData.data.status,
      createdBy: auth.user.userId,
      changeHistory: JSON.stringify([{
        action: "created",
        date: new Date().toISOString(),
        userId: auth.user.userId,
        data: validatedData.data
      }])
    }).returning();

    await createAuditLog(
      auth.user.userId,
      "CREATE_TRANSACTION",
      "financial_transactions",
      newTransaction.id,
      { type: newTransaction.type, amount: newTransaction.amount }
    );

    return NextResponse.json({
      message: "Transaksi berhasil ditambahkan",
      data: newTransaction
    }, { status: 201 });
  } catch (error) {
    console.error("Create finance error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menambahkan transaksi" },
      { status: 500 }
    );
  }
}
