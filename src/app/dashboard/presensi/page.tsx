"use client";

import { useState, useEffect, useRef } from "react";
import { CalendarDays, Users, AlertCircle, Clock } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  location: string | null;
  status: "rencana" | "berlangsung" | "selesai" | "dibatalkan";
  description: string | null;
}

const statusLabels: Record<string, string> = {
  rencana: "Rencana",
  berlangsung: "Berlangsung",
  selesai: "Selesai",
  dibatalkan: "Dibatalkan"
};

const statusColors: Record<string, string> = {
  rencana: "bg-blue-100 text-blue-800",
  berlangsung: "bg-yellow-100 text-yellow-800",
  selesai: "bg-green-100 text-green-800",
  dibatalkan: "bg-red-100 text-red-800"
};

export default function PresensiPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const initialSelectDone = useRef(false);

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal memuat data kegiatan");
        return res.json();
      })
      .then((data) => {
        const all = data.data || [];
        setActivities(all);
        if (!initialSelectDone.current) {
          initialSelectDone.current = true;
          const upcoming = all
            .filter((a: Activity) => a.status !== "selesai" && a.status !== "dibatalkan")
            .sort((a: Activity, b: Activity) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
          if (upcoming.length > 0) {
            setSelectedActivity(upcoming[0].id);
          }
        }
      })
      .catch((e) => {
        if (e instanceof Error) setError(e.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedActivityData = activities.find((a) => a.id === selectedActivity);

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-96 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in text-center py-16">
        <CalendarDays className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">Gagal memuat halaman presensi</h3>
        <p className="text-gray-500 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Presensi Kegiatan</h2>
          <p className="text-gray-500 mt-1">Kelola kehadiran anggota pada setiap kegiatan</p>
        </div>
        {selectedActivityData && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>
              {new Date(selectedActivityData.startDate).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Pilih Kegiatan
        </h3>
        {activities.filter((a) => a.status !== "dibatalkan").length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada kegiatan tersedia untuk dipilih
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities
              .filter((a) => a.status !== "dibatalkan")
              .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
              .map((activity) => (
                <button
                  key={activity.id}
                  onClick={() => setSelectedActivity(activity.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedActivity === activity.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.startDate).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </p>
                  <span className={`mt-2 inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[activity.status]}`}>
                    {statusLabels[activity.status]}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>

      {selectedActivityData && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900 text-lg">
              Daftar Hadir — {selectedActivityData.title}
            </h3>
            <span className="text-sm text-gray-500">
              {new Date(selectedActivityData.startDate).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">No</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">Nama Anggota</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">No. Anggota</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Hadir</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Tidak Hadir</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Izin</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm">Sakit</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    Fitur presensi akan tersedia saat kegiatan dimulai
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!selectedActivityData && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p>Pilih kegiatan untuk mengelola presensi</p>
        </div>
      )}
    </div>
  );
}
