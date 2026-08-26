"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X, Calendar, MapPin, User, Wallet, FileText, Clock } from "lucide-react";

interface ActivityForm {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  responsiblePerson: string;
  budget: string;
  status: "rencana" | "berlangsung" | "selesai" | "dibatalkan";
}

export default function TambahKegiatanPage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ActivityForm>({
    title: "",
    description: "",
    location: "",
    startDate: today,
    endDate: "",
    responsiblePerson: "",
    budget: "",
    status: "rencana"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menambahkan kegiatan");
        return;
      }

      router.push("/dashboard/kegiatan");
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof ActivityForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formFields: Array<{
    key: keyof ActivityForm;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    required: boolean;
    type: "text" | "date" | "textarea" | "select" | "number";
    options?: { value: string; label: string }[];
  }> = [
    { key: "title", label: "Nama Kegiatan", icon: FileText, required: true, type: "text" },
    { key: "startDate", label: "Tanggal Mulai", icon: Calendar, required: true, type: "date" },
    { key: "endDate", label: "Tanggal Selesai", icon: Calendar, required: false, type: "date" },
    { key: "location", label: "Lokasi", icon: MapPin, required: false, type: "text" },
    { key: "responsiblePerson", label: "Penanggung Jawab", icon: User, required: false, type: "text" },
    { key: "budget", label: "Anggaran", icon: Wallet, required: false, type: "number" },
    { key: "status", label: "Status", icon: Clock, required: true, type: "select", options: [
      { value: "rencana", label: "Rencana" },
      { value: "berlangsung", label: "Berlangsung" },
      { value: "selesai", label: "Selesai" },
      { value: "dibatalkan", label: "Dibatalkan" }
    ]},
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tambah Kegiatan</h2>
          <p className="text-gray-500 mt-1">Buat kegiatan baru untuk Karang Taruna</p>
        </div>
        <Link
          href="/dashboard/kegiatan"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
        >
          <X className="w-5 h-5" />
          Batal
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Informasi Kegiatan</h3>
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
                ) : field.type === "textarea" ? (
                  <textarea
                    value={form[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
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
              Deskripsi
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Deskripsikan kegiatan ini..."
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
            href="/dashboard/kegiatan"
            className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting || !form.title}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl"
          >
            <Save className="w-5 h-5" />
            {submitting ? "Menyimpan..." : "Simpan Kegiatan"}
          </button>
        </div>
      </form>
    </div>
  );
}
