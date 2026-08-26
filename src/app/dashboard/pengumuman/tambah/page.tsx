"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X, FileText, Type, Clock, Globe } from "lucide-react";

interface AnnouncementForm {
  title: string;
  content: string;
  type: string;
  isPublished: boolean;
}

export default function TambahPengumumanPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<AnnouncementForm>({
    title: "",
    content: "",
    type: "pengumuman",
    isPublished: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menambahkan pengumuman");
        return;
      }

      router.push("/dashboard/pengumuman");
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof AnnouncementForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const announcementTypes = [
    { value: "pengumuman", label: "Pengumuman" },
    { value: "kegiatan", label: "Kegiatan" },
    { value: "informasi", label: "Informasi" },
    { value: "penting", label: "Penting" }
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tambah Pengumuman</h2>
          <p className="text-gray-500 mt-1">Buat pengumuman baru untuk warga</p>
        </div>
        <Link
          href="/dashboard/pengumuman"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
        >
          <X className="w-5 h-5" />
          Batal
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Type className="w-4 h-4 text-gray-400" />
                Judul Pengumuman <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Masukkan judul pengumuman..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                Tipe Pengumuman
              </label>
              <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {announcementTypes.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-400" />
              Konten <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => handleChange("content", e.target.value)}
              rows={8}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Tulis konten pengumuman di sini..."
            />
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center h-5 pt-1">
              <input
                type="checkbox"
                id="isPublished"
                checked={form.isPublished}
                onChange={(e) => handleChange("isPublished", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="isPublished" className="block text-sm font-medium text-gray-700 mb-1">
                Publikasikan
              </label>
              <p className="text-sm text-gray-500">
                Centang untuk mempublikasikan pengumuman ini secara langsung
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/pengumuman"
            className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting || !form.title || !form.content}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl"
          >
            <Save className="w-5 h-5" />
            {submitting ? "Menyimpan..." : "Simpan Pengumuman"}
          </button>
        </div>
      </form>
    </div>
  );
}
