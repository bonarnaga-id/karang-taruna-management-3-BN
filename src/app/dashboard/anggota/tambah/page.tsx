"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X, User, Phone, Mail, Calendar, MapPin, GraduationCap, Briefcase, Award, Clock } from "lucide-react";

interface MemberForm {
  fullName: string;
  birthPlace: string;
  birthDate: string;
  gender: "laki_laki" | "perempuan" | "";
  address: string;
  phone: string;
  email: string;
  education: string;
  occupation: string;
  skills: string;
  joinDate: string;
  status: "aktif" | "tidak_aktif" | "pending" | "dikeluarkan";
}

export default function TambahAnggotaPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<MemberForm>({
    fullName: "",
    birthPlace: "",
    birthDate: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    education: "",
    occupation: "",
    skills: "",
    joinDate: new Date().toISOString().split("T")[0],
    status: "aktif"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal menambahkan anggota");
        return;
      }

      const data = await res.json();
      router.push("/dashboard/anggota");
    } catch (e) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof MemberForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formFields: Array<{
    key: keyof MemberForm;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    required: boolean;
    type: "text" | "date" | "tel" | "email" | "select" | "textarea";
    options?: { value: string; label: string }[];
  }> = [
    { key: "fullName", label: "Nama Lengkap", icon: User, required: true, type: "text" as const },
    { key: "birthPlace", label: "Tempat Lahir", icon: MapPin, required: false, type: "text" as const },
    { key: "birthDate", label: "Tanggal Lahir", icon: Calendar, required: false, type: "date" as const },
    { key: "gender", label: "Jenis Kelamin", icon: User, required: false, type: "select" as const, options: [
      { value: "laki_laki", label: "Laki-laki" },
      { value: "perempuan", label: "Perempuan" }
    ]},
    { key: "address", label: "Alamat", icon: MapPin, required: false, type: "textarea" as const },
    { key: "phone", label: "No. Telepon", icon: Phone, required: false, type: "tel" as const },
    { key: "email", label: "Email", icon: Mail, required: false, type: "email" as const },
    { key: "education", label: "Pendidikan Terakhir", icon: GraduationCap, required: false, type: "text" as const },
    { key: "occupation", label: "Pekerjaan", icon: Briefcase, required: false, type: "text" as const },
    { key: "skills", label: "Keahlian", icon: Award, required: false, type: "text" as const },
    { key: "joinDate", label: "Tanggal Bergabung", icon: Clock, required: false, type: "date" as const },
    { key: "status", label: "Status Anggota", icon: Clock, required: true, type: "select" as const, options: [
      { value: "aktif", label: "Aktif" },
      { value: "pending", label: "Pending" },
      { value: "tidak_aktif", label: "Tidak Aktif" },
      { value: "dikeluarkan", label: "Dikeluarkan" }
    ]}
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tambah Anggota Baru</h2>
          <p className="text-gray-500 mt-1">Masukkan data anggota Karang Taruna baru</p>
        </div>
        <Link
          href="/dashboard/anggota"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <X className="w-5 h-5" />
          Batal
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Data Pribadi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.slice(0, 4).map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <field.icon className="w-4 h-4 text-gray-400" />
                  {field.label}{field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    value={form[field.key as keyof MemberForm] as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {field.options!.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={form[field.key as keyof MemberForm] as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={form[field.key as keyof MemberForm] as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Data Kontak & Pendidikan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.slice(4, 8).map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <field.icon className="w-4 h-4 text-gray-400" />
                  {field.label}{field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    value={form[field.key as keyof MemberForm] as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {field.options!.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={form[field.key as keyof MemberForm] as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Data Kepengurusan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.slice(8, 10).map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  <field.icon className="w-4 h-4 text-gray-400" />
                  {field.label}{field.required && <span className="text-red-500">*</span>}
                </label>
                {field.type === "select" ? (
                  <select
                    value={form[field.key as keyof MemberForm] as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {field.options!.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={form[field.key as keyof MemberForm] as string}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/anggota"
            className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting || !form.fullName}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
          >
            <Save className="w-5 h-5" />
            {submitting ? "Menyimpan..." : "Simpan Anggota"}
          </button>
        </div>
      </form>
    </div>
  );
}
