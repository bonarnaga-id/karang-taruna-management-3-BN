"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users, Calendar, DollarSign, FileText, Newspaper,
  TrendingUp, ArrowUpRight, ArrowDownRight, Clock
} from "lucide-react";

interface StatsCard {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatsCard[]>([
    { title: "Total Anggota", value: "0", icon: Users, color: "from-blue-500 to-blue-600", href: "/dashboard/anggota" },
    { title: "Kegiatan Aktif", value: "0", icon: Calendar, color: "from-emerald-500 to-emerald-600", href: "/dashboard/kegiatan" },
    { title: "Saldo Kas", value: "Rp0", icon: DollarSign, color: "from-purple-500 to-purple-600", href: "/dashboard/keuangan" },
    { title: "Dokumen", value: "0", icon: FileText, color: "from-orange-500 to-orange-600", href: "/dashboard/dokumen" }
  ]);
  
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch activities count
        const actRes = await fetch("/api/activities?limit=5");
        const actData = await actRes.json();
        if (actData.data) {
          setRecentActivities(actData.data);
          const activeCount = actData.data.filter((a: any) => a.status === 'berlangsung').length;
          updateStat("Kegiatan Aktif", String(activeCount));
          updateStat("Kegiatan Aktif", String(actData.data.length));
        }

        // Fetch announcements
        const annRes = await fetch("/api/announcements?limit=3");
        const annData = await annRes.json();
        if (annData.data) {
          setRecentAnnouncements(annData.data);
        }

        // Fetch member count (needs auth)
        try {
          const memRes = await fetch("/api/members?limit=1");
          if (memRes.ok) {
            const memData = await memRes.json();
            if (memData.pagination) {
              updateStat("Total Anggota", String(memData.pagination.total));
            }
          }
        } catch {}
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const updateStat = (title: string, value: string) => {
    setStats(prev => prev.map(s => s.title === title ? {...s, value} : s));
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Selamat datang di panel manajemen Karyuna</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors -translate-y-1 translate-x-1 group-hover:translate-x-0 group-hover:translate-y-0 opacity-0 group-hover:opacity-100" />
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Kegiatan Terbaru</h3>
            </div>
            <Link href="/dashboard/kegiatan" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Lihat Semua →
            </Link>
          </div>
          
          <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.slice(0, 5).map((activity: any) => (
                <div key={activity.id} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                    <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(activity.startDate).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <span className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full capitalize ${
                    activity.status === 'selesai' ? 'bg-green-100 text-green-700' :
                    activity.status === 'berlangsung' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Belum ada kegiatan</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <Newspaper className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">Pengumuman Terbaru</h3>
            </div>
            <Link href="/dashboard/pengumuman" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Lihat Semua →
            </Link>
          </div>
          
          <div className="divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
            {recentAnnouncements.length > 0 ? (
              recentAnnouncements.map((announcement: any) => (
                <div key={announcement.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900 line-clamp-1">{announcement.title}</h4>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{announcement.content}</p>
                  <time className="text-xs text-gray-400 mt-2 block">
                    {new Date(announcement.createdAt).toLocaleDateString("id-ID")}
                  </time>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <Newspaper className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Belum ada pengumuman</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Aksi Cepat</h3>
            <p className="text-blue-200 max-w-lg">
              Lakukan tugas sehari-hari dengan cepat menggunakan aksi berikut
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/anggota/tambah" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors">
              <Users className="w-4 h-4" /> Tambah Anggota
            </Link>
            <Link href="/dashboard/kegiatan/tambah" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors">
              <Calendar className="w-4 h-4" /> Buat Kegiatan
            </Link>
            <Link href="/dashboard/keuangan/tambah" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors">
              <DollarSign className="w-4 h-4" /> Catat Kas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
