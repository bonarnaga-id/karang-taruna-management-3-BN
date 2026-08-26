"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet, Calendar, ArrowRightLeft, FileText } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  type: "pemasukan" | "pengeluaran";
  category: string;
  amount: string;
  source: string | null;
  description: string | null;
  proofUrl: string | null;
  status: "pending" | "disetujui" | "ditolak";
  approvedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface FinanceSummary {
  data: Transaction[];
  summary: {
    totalPemasukan: number;
    totalPengeluaran: number;
    saldo: number;
  };
}

const typeLabels: Record<string, string> = {
  pemasukan: "Pemasukan",
  pengeluaran: "Pengeluaran"
};

const typeColors: Record<string, string> = {
  pemasukan: "bg-green-100 text-green-800",
  pengeluaran: "bg-red-100 text-red-800"
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  disetujui: "Disetujui",
  ditolak: "Ditolak"
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  disetujui: "bg-green-100 text-green-800",
  ditolak: "bg-red-100 text-red-800"
};

export default function LaporanKeuanganPage() {
  const [data, setData] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getFullYear() + "-" + String(new Date().getMonth() + 1).padStart(2, "0"));

  useEffect(() => {
    fetch("/api/finance")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-100 rounded-2xl" />
            <div className="h-32 bg-gray-100 rounded-2xl" />
            <div className="h-32 bg-gray-100 rounded-2xl" />
          </div>
          <div className="h-80 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="animate-fade-in text-center py-16">
        <Wallet className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Gagal memuat data keuangan</h3>
      </div>
    );
  }

  const transactions = data.data || [];
  const approvedTransactions = transactions.filter((t) => t.status === "disetujui");

  const totalPemasukan = approvedTransactions
    .filter((t) => t.type === "pemasukan")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalPengeluaran = approvedTransactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const currentSaldo = totalPemasukan - totalPengeluaran;

  const monthlyData = transactions
    .filter((t) => t.status === "disetujui")
    .reduce((acc: Record<string, { pemasukan: number; pengeluaran: number }>, t) => {
      const monthKey = new Date(t.date).toLocaleString("id-ID", { month: "short", year: "numeric" });
      if (!acc[monthKey]) acc[monthKey] = { pemasukan: 0, pengeluaran: 0 };
      acc[monthKey][t.type] += Number(t.amount);
      return acc;
    }, {});

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Laporan Keuangan</h2>
          <p className="text-gray-500 mt-1">Ringkasan pemasukan dan pengeluaran organisasi</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {Object.keys(monthlyData)
              .sort()
              .map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">Total Pemasukan</h3>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPemasukan)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {approvedTransactions.filter((t) => t.type === "pemasukan").length} transaksi
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">Total Pengeluaran</h3>
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalPengeluaran)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {approvedTransactions.filter((t) => t.type === "pengeluaran").length} transaksi
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">Saldo Saat Ini</h3>
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <p className={`text-2xl font-bold ${currentSaldo >= 0 ? "text-blue-600" : "text-red-600"}`}>
            {formatCurrency(currentSaldo)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Saldo akhir (pemasukan - pengeluaran)
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5" />
          Laporan Bulanan
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="py-3 px-4 font-medium text-gray-600">Periode</th>
                <th className="py-3 px-4 font-medium text-gray-600 text-right">Pemasukan</th>
                <th className="py-3 px-4 font-medium text-gray-600 text-right">Pengeluaran</th>
                <th className="py-3 px-4 font-medium text-gray-600 text-right">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(monthlyData)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([period, amounts]) => {
                  const saldo = amounts.pemasukan - amounts.pengeluaran;
                  return (
                    <tr key={period} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">{period}</td>
                      <td className="py-3 px-4 text-right text-green-600">{formatCurrency(amounts.pemasukan)}</td>
                      <td className="py-3 px-4 text-right text-red-600">{formatCurrency(amounts.pengeluaran)}</td>
                      <td className={`py-3 px-4 text-right font-medium ${saldo >= 0 ? "text-blue-600" : "text-red-600"}`}>
                        {formatCurrency(saldo)}
                      </td>
                    </tr>
                  );
                })}
              {Object.keys(monthlyData).length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400">
                    Tidak ada data keuangan tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Riwayat Transaksi
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-left">
                <th className="py-3 px-4 font-medium text-gray-600">Tanggal</th>
                <th className="py-3 px-4 font-medium text-gray-600">Kategori</th>
                <th className="py-3 px-4 font-medium text-gray-600">Jenis</th>
                <th className="py-3 px-4 font-medium text-gray-600 text-right">Nominal</th>
                <th className="py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="py-3 px-4 font-medium text-gray-600">Sumber</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 20).map((t) => (
                <tr key={t.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">
                    {new Date(t.date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-3 px-4 text-gray-900">{t.category}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[t.type]}`}>
                      {typeLabels[t.type]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    {formatCurrency(Number(t.amount))}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[t.status]}`}>
                      {statusLabels[t.status]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{t.source || "-"}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Tidak ada transaksi keuangan tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
