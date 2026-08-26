"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, Filter, Search } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startDate: string;
  endDate?: string | null;
  status: string;
}

export default function KegiatanPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const statusFilters = [
    { value: "", label: "Semua" },
    { value: "rencana", label: "Rencana" },
    { value: "berlangsung", label: "Berlangsung" },
    { value: "selesai", label: "Selesai" }
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      rencana: "bg-blue-100 text-blue-700",
      berlangsung: "bg-amber-100 text-amber-700",
      selesai: "bg-green-100 text-green-700",
      dibatalkan: "bg-red-100 text-red-700"
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  useEffect(() => {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        setActivities(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredActivities = filterStatus
    ? activities.filter(a => a.status === filterStatus)
    : activities;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-red-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-orange-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kegiatan</h1>
          <p className="text-lg text-orange-100 max-w-2xl mx-auto">
            Jadual dan dokumentasi kegiatan organisasi Karang Taruna
          </p>
        </div>
      </section>

      {/* Activities Content */}
      <section className="py-12 md:py-20 bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              {statusFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === f.value
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="ml-auto text-sm text-gray-500">
              {filteredActivities.length} kegiatan ditemukan
            </div>
          </div>

          {/* Activities Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-24 bg-gray-200 rounded-full" />
                    <div className="h-5 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredActivities.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <article
                  key={activity.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`h-40 relative ${
                    activity.status === 'selesai' ? 'bg-emerald-500' :
                    activity.status === 'berlangsung' ? 'bg-amber-500' :
                    'bg-gradient-to-br from-blue-400 to-indigo-500'
                  }`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="w-16 h-16 text-white/30" />
                    </div>
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(activity.status)}`}>
                      {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {activity.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {activity.description || "Tidak ada deskripsi"}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatDate(activity.startDate)}
                        {activity.endDate && ` - ${formatDate(activity.endDate)}`}
                      </div>
                      {activity.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {activity.location}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-16">
              <Calendar className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">Belum Ada Kegiatan</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Kegiatan akan ditampilkan di sini setelah admin memasukkan data kegiatan.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
