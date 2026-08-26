"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, X, User, Phone, Mail, Calendar, MapPin, GraduationCap, Briefcase, Award, Clock } from "lucide-react";

interface Member {
  id: string;
  memberNumber: string;
  fullName: string;
  birthPlace: string | null;
  birthDate: string | null;
  gender: "laki_laki" | "perempuan" | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  education: string | null;
  occupation: string | null;
  skills: string | null;
  joinDate: string | null;
  status: "aktif" | "tidak_aktif" | "pending" | "dikeluarkan";
  photo: string | null;
  createdAt: string;
  updatedAt: string;
}

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

export default function EditAnggotaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [member, setMember] = useState<Member | null>(null);
  const [form, setForm] = useState<MemberForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMember = useCallback(() => {
    fetch(`/api/members/${resolvedParams.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          const m: Member = data.data;
          setMember(m);
          setForm({
            fullName: m.fullName || "",
            birthPlace: m.birthPlace || "",
            birthDate: m.birthDate ? m.birthDate.split("T")[0] : "",
            gender: m.gender as "laki_laki" | "perempuan" | "",
            address: m.address || "",
            phone: m.phone || "",
            email: m.email || "",
            education: m.education || "",
            occupation: m.occupation || "",
            skills: m.skills || "",
            joinDate: m.joinDate ? m.joinDate.split("T")[0] : new Date().toISOString().split("T")[0],
            status: m.status
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  useEffect(() => { fetchMember(); }, [fetchMember]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !form.fullName) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/members/${resolvedParams.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal memperbarui anggota");
        return;
      }

      router.push("/dashboard/anggota");
    } catch {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof MemberForm, value: string) => {
    if (!form) return;
    setForm({ ...form, [field]: value });
  };

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="p-6 space-y-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!form || !member) {
    return (
      <div className="animate-fade-in text-center py-16">
        <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Anggota tidak ditemukan</h3>
        <Link href="/dashboard/anggota" className="text-blue-600 hover:text-blue-700 font-medium">
          Kembali ke daftar anggota
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Anggota</h2>
          <p className="text-gray-500 mt-1">
            No. Anggota: <span className="font-mono text-gray-700">{member.memberNumber}</span>
          </p>
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
                    value={form[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {field.options!.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={(form[field.key] as string) || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                ) : (
                  <input
                    type={field.type}
                    value={(form[field.key] as string) || ""}
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
                    value={form[field.key] || ""}
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
                    value={(form[field.key] as string) || ""}
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
                    value={form[field.key] || ""}
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
                    value={(form[field.key] as string) || ""}
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
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
