"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Plus, Search, Edit2, Trash2, Eye } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  startDate: string;
  location?: string | null;
  status: string;
}

export default function KegiatanDashboardPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities?limit=20")
      .then((r) => r.json())
      .then((d) => { setActivities(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kegiatan ini?")) return;
    await fetch(`/api/activities/${id}`, { method: "DELETE" });
    setActivities(activities.filter(a => a.id !== id));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Kegiatan</h2>
          <p className="text-gray-500 mt-1">Kelola kegiatan organisasi Karang Taruna</p>
        </div>
        <Link href="/dashboard/kegiatan/tambah" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
          <Plus className="w-5 h-5" /> Tambah Kegiatan
        </Link>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Rencana", color: "bg-blue-100 text-blue-700", filter: (a: Activity) => a.status === "rencana" },
          { label: "Berlangsung", color: "bg-amber-100 text-amber-700", filter: (a: Activity) => a.status === "berlangsung" },
          { label: "Selesai", color: "bg-green-100 text-green-700", filter: (a: Activity) => a.status === "selesai" },
          { label: "Dibatalkan", color: "bg-red-100 text-red-700", filter: (a: Activity) => a.status === "dibatalkan" }
        ].map(stat => (
          <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
            <p className="text-2xl font-bold">{activities.filter(stat.filter).length}</p>
            <p className="text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-lg" />)}</div>
        ) : activities.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {activities.map(activity => (
              <div key={activity.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate">{activity.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5 flex gap-3">
                    <span>📅 {new Date(activity.startDate).toLocaleDateString("id-ID")}</span>
                    {activity.location && <span>📍 {activity.location}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    activity.status === "selesai" ? "bg-green-100 text-green-700" :
                    activity.status === "berlangsung" ? "bg-amber-100 text-amber-700" :
                    activity.status === "dibatalkan" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                  }`}>{activity.status}</span>
                  <button type="button" onClick={() => {}} className="p-2 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4 text-gray-400" /></button>
                  <Link href={`/dashboard/kegiatan/${activity.id}/edit`} className="p-2 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4 text-blue-500" /></Link>
                  <button type="button" onClick={() => handleDelete(activity.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Belum Ada Kegiatan</h3>
            <Link href="/dashboard/kegiatan/tambah" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl mt-4">
              <Plus className="w-5 h-5" /> Buat Kegiatan Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
