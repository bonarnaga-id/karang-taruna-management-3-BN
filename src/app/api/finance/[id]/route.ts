import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { financialTransactions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { requireAuth, hasPermission, canApproveFinance } from "@/lib/auth-middleware";
import { createAuditLog } from "@/lib/audit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    const { id } = await params;
    
    const [transaction] = await db.select()
      .from(financialTransactions)
      .where(eq(financialTransactions.id, id));

    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ data: transaction });
  } catch (error) {
    console.error("Get transaction error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_finances")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk mengubah transaksi" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    
    // Cek transaksi ada
    const [existingTransaction] = await db.select()
      .from(financialTransactions)
      .where(eq(financialTransactions.id, id));

    if (!existingTransaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    // Update transaksi - sederhanakan update
    const [updatedTransaction] = await db.update(financialTransactions)
      .set({
        date: body.date ?? existingTransaction.date,
        type: body.type ?? existingTransaction.type,
        category: body.category ?? existingTransaction.category,
        amount: String(body.amount || existingTransaction.amount),
        source: body.source ?? existingTransaction.source,
        description: body.description ?? existingTransaction.description,
        status: body.status ?? existingTransaction.status,
        proofUrl: body.proofUrl ?? existingTransaction.proofUrl,
        updatedAt: new Date()
      })
      .where(eq(financialTransactions.id, id))
      .returning();

    await createAuditLog(
      auth.user.userId,
      "UPDATE_TRANSACTION",
      "financial_transactions",
      id,
      body
    );

    return NextResponse.json({
      message: "Transaksi berhasil diperbarui",
      data: updatedTransaction
    });
  } catch (error) {
    console.error("Update transaction error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// Approve/Reject transaction
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!canApproveFinance(auth.user.role)) {
      return NextResponse.json(
        { error: "Anda tidak memiliki wewenang untuk menyetujui transaksi" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body; // approve or reject

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Aksi tidak valid. Gunakan 'approve' atau 'reject'" },
        { status: 400 }
      );
    }

    const [transaction] = await db.select()
      .from(financialTransactions)
      .where(eq(financialTransactions.id, id));

    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    const newStatus = action === "approve" ? "disetujui" : "ditolak";
    
    const [updated] = await db.update(financialTransactions)
      .set({
        status: newStatus,
        approvedBy: auth.user.userId,
        updatedAt: new Date()
      })
      .where(eq(financialTransactions.id, id))
      .returning();

    await createLog(auth.user.userId, action.toUpperCase() + "_TRANSACTION", "financial_transactions", id);

    return NextResponse.json({
      message: `Transaksi berhasil ${action === "approve" ? "disetujui" : "ditolak"}`,
      data: updated
    });
  } catch (error) {
    console.error("Patch transaction error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;

    if (!hasPermission(auth.user.role, "manage_finances")) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses untuk menghapus transaksi" },
        { status: 403 }
      );
    }

    const { id } = await params;
    
    const [transaction] = await db.select()
      .from(financialTransactions)
      .where(eq(financialTransactions.id, id));

    if (!transaction) {
      return NextResponse.json({ error: "Transaksi tidak ditemukan" }, { status: 404 });
    }

    await db.delete(financialTransactions).where(eq(financialTransactions.id, id));
    
    await createLog(auth.user.userId, "DELETE_TRANSACTION", "financial_transactions", id);

    return NextResponse.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

async function createLog(userId: string, action: string, entity: string, entityId: string): Promise<void> {
  await createAuditLog(userId, action, entity, entityId);
}
