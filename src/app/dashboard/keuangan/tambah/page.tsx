"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X, Calendar, Wallet, Tag, FileText, User, Clock } from "lucide-react";

interface TransactionForm {
  date: string;
  type: "pemasukan" | "pengeluaran";
  category: string;
  amount: string;
  source: string;
  description: string;
  status: "pending" | "disetujui" | "ditolak";
}

export default function TambahKeuanganPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<TransactionForm>({
    date: today,
    type: "pemasukan",
    category: "",
    amount: "",
    source: "",
    description: "",
    status: "pending"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menambahkan transaksi");
        return;
      }

      router.push("/dashboard/keuangan");
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof TransactionForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formFields: Array<{
    key: keyof TransactionForm;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    required: boolean;
    type: "text" | "date" | "select" | "number";
    options?: { value: string; label: string }[];
  }> = [
    { key: "date", label: "Tanggal", icon: Calendar, required: true, type: "date" },
    { key: "type", label: "Tipe Transaksi", icon: Wallet, required: true, type: "select", options: [
      { value: "pemasukan", label: "Pemasukan" },
      { value: "pengeluaran", label: "Pengeluaran" }
    ]},
    { key: "category", label: "Kategori", icon: Tag, required: true, type: "text" },
    { key: "amount", label: "Nominal", icon: Wallet, required: true, type: "number" },
    { key: "source", label: "Sumber/Dari", icon: User, required: false, type: "text" },
    { key: "status", label: "Status", icon: Clock, required: true, type: "select", options: [
      { value: "pending", label: "Pending" },
      { value: "disetujui", label: "Disetujui" },
      { value: "ditolak", label: "Ditolak" }
    ]},
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tambah Transaksi Keuangan</h2>
          <p className="text-gray-500 mt-1">Catat transaksi pemasukan atau pengeluaran baru</p>
        </div>
        <Link
          href="/dashboard/keuangan"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
        >
          <X className="w-5 h-5" />
          Batal
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Informasi Transaksi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <field.icon className="w-4 h-4 text-gray-400" />
                  {field.label}{field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    value={form[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {field.options!.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === "number" ? "text" : field.type}
                    value={form[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Keterangan
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Keterangan transaksi..."
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/keuangan"
            className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting || !form.amount || !form.category}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl"
          >
            <Save className="w-5 h-5" />
            {submitting ? "Menyimpan..." : "Simpan Transaksi"}
          </button>
        </div>
      </form>
    </div>
  );
}
