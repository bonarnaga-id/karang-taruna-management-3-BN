"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, Plus, TrendingUp, TrendingDown, CheckCircle, XCircle, Clock } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface Transaction {
  id: string;
  date: string;
  type: string;
  category: string;
  amount: string;
  description?: string | null;
  status: string;
}

export default function KeuanganPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ totalPemasukan: 0, totalPengeluaran: 0, saldo: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/finance")
      .then((r) => {
        if (!r.ok) {
          return r.json().then((d) => {
            throw new Error(d.error || "Gagal memuat data keuangan");
          });
        }
        return r.json();
      })
      .then((d) => {
        setTransactions(d.data || []);
        if (d.summary) setSummary(d.summary);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Terjadi kesalahan saat memuat data");
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id: string, action: string) => {
    const res = await fetch(`/api/finance/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json();
      setError(data.error || "Gagal memproses transaksi");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Keuangan</h2>
          <p className="text-gray-500 mt-1">Kelola transaksi kas masuk dan keluar</p>
        </div>
        <Link href="/dashboard/keuangan/tambah" className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors">
          <Plus className="w-5 h-5" /> Catat Transaksi
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-emerald-700">Total Pemasukan</span>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-800">{formatRupiah(summary.totalPemasukan)}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5 border border-orange-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-700">Total Pengeluaran</span>
            <TrendingDown className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-orange-800">{formatRupiah(summary.totalPengeluaran)}</p>
        </div>

        <div className={`bg-gradient-to-br rounded-xl p-5 border ${summary.saldo >= 0 ? 'from-blue-50 to-indigo-50 border-blue-100' : 'from-red-50 to-pink-50 border-red-100'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${summary.saldo >= 0 ? 'text-blue-700' : 'text-red-700'}`}>Saldo Kas</span>
            <DollarSign className={`w-5 h-5 ${summary.saldo >= 0 ? 'text-blue-500' : 'text-red-500'}`} />
          </div>
          <p className={`text-2xl font-bold ${summary.saldo >= 0 ? 'text-blue-800' : 'text-red-800'}`}>{formatRupiah(summary.saldo)}</p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Daftar Transaksi</h3>
        </div>

        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-lg" />)}</div>
        ) : error ? (
          <div className="p-6 text-center">
            <DollarSign className="w-12 h-12 mx-auto text-red-300 mb-3" />
            <p className="text-red-600">{error}</p>
          </div>
        ) : transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Tanggal", "Jenis", "Kategori", "Nominal", "Status", "Aksi"].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(t.date).toLocaleDateString("id-ID")}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${t.type === "pemasukan" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"}`}>
                        {t.type === "pemasukan" ? "Masuk" : "Keluar"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{t.category}</td>
                    <td className="px-6 py-4 font-semibold">{formatRupiah(Number(t.amount))}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        t.status === "disetujui" ? "bg-green-100 text-green-700" :
                        t.status === "ditolak" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {t.status === "disetujui" && <CheckCircle className="w-3 h-3" />}
                        {t.status === "ditolak" && <XCircle className="w-3 h-3" />}
                        {t.status === "pending" && <Clock className="w-3 h-3" />}
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {t.status === "pending" && (
                        <div className="flex gap-1">
                          <button type="button" onClick={() => handleApprove(t.id, "approve")} className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">Setujui</button>
                          <button type="button" onClick={() => handleApprove(t.id, "reject")} className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">Tolak</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <DollarSign className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Belum Ada Transaksi</h3>
          </div>
        )}
      </div>
    </div>
  );
}
