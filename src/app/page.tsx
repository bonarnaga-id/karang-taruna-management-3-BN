"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, Users, Calendar, Target, Newspaper,
  Heart, Shield, Zap, Star, ChevronRight, Activity
} from "lucide-react";
import { appConfig } from "@/lib/config";

interface ActivityData {
  id: string;
  title: string;
  startDate: string;
  status: string;
}

interface AnnouncementData {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: string;
}

export default function BerandaPage() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementData[]>([]);

  useEffect(() => {
    // Fetch recent activities
    fetch("/api/activities?limit=3")
      .then((res) => res.json())
      .then((data) => setActivities(data.data || []))
      .catch(() => {});

    // Fetch announcements
    fetch("/api/announcements?limit=3")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data.data || []))
      .catch(() => {});
  }, []);

  const features = [
    {
      icon: Users,
      title: "Manajemen Anggota",
      description: "Kelola data anggota lengkap dengan mudah dan terorganisir",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Calendar,
      title: "Kegiatan & Kalender",
      description: "Atur jadwal kegiatan dan pantau progres secara real-time",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Target,
      title: "Struktur Organisasi",
      description: "Visualisasi struktur organisasi yang informatif",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "Keuangan Terpadu",
      description: "Pencatatan kas pemasukan dan pengeluaran yang transparan",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Newspaper,
      title: "Dokumen & Surat",
      description: "Kelola proposal, laporan, surat masuk dan keluar",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Zap,
      title: "Presensi Digital",
      description: "Sistem presensi kegiatan yang praktis dan akurat",
      color: "from-cyan-500 to-cyan-600"
    }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 text-yellow-400" />
                Sistem Manajemen Karang Taruna Modern
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Selamat Datang di
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Karyuna
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 leading-relaxed mb-8 max-w-lg">
                Platform digital untuk mengelola organisasi Karang Taruna dengan 
                mudah. Kelola anggota, kegiatan, keuangan, dan dokumen dalam satu tempat.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/20"
                >
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 hover:bg-white/10 font-semibold rounded-xl transition-colors"
                >
                  Pelajari Lebih Lanjut
                </Link>
              </div>
            </div>

            {/* Stats Card */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-bold mb-6">Statistik Organisasi</h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: "Total Anggota", value: "150+", icon: Users },
                    { label: "Kegiatan Tahun Ini", value: "24", icon: Calendar },
                    { label: "Bidang Kerja", value: "7", icon: Target },
                    { label: "Tahun Aktif", value: "5+", icon: Activity }
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                      <stat.icon className="w-8 h-8 mb-2 text-yellow-300" />
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-sm text-blue-200">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Fitur Lengkap untuk Kemajuan Organisasi
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola organisasi Karang Taruna 
              dengan efisien dan modern.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-transparent transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-5 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activities Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Kegiatan Terbaru</h2>
              <p className="text-gray-600">KegiatanKarang Taruna yang akan datang dan telah selesai</p>
            </div>
            <Link
              href="/kegiatan"
              className="hidden sm:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-40 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-white/80" />
                  </div>
                  <div className="p-5">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'selesai' ? 'bg-green-100 text-green-700' :
                      activity.status === 'berlangsung' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {activity.status}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-3 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      📅 {new Date(activity.startDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 w-20 bg-gray-200 rounded-full" />
                    <div className="h-5 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mobile link */}
          <div className="mt-6 text-center sm:hidden">
            <Link href="/kegiatan" className="text-blue-600 hover:text-blue-700 font-medium">
              Lihat semua kegiatan →
            </Link>
          </div>
        </div>
      </section>

      {/* News / Announcements Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Berita & Pengumuman</h2>
              <p className="text-gray-600">Informasi terbaru dari organisasi</p>
            </div>
            <Link
              href="/berita"
              className="hidden sm:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.length > 0 ? (
              announcements.slice(0, 3).map((announcement) => (
                <article
                  key={announcement.id}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      announcement.type === 'berita' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {announcement.type === 'berita' ? 'Berita' : 'Pengumuman'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(announcement.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {announcement.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">{announcement.content}</p>
                </article>
              ))
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    <div className="h-6 w-24 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-5 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-4/5 bg-gray-200 rounded" />
                  <div className="h-4 w-3/5 bg-gray-200 rounded" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Heart className="w-12 h-12 mx-auto mb-6 text-red-300" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bergabunglah Bersama Kami
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Jadilah bagian dari generasi muda yang bergerak untuk kemajuan desa 
            dan bangsa. Daftarkan diri Anda sebagai anggota Karang Taruna sekarang!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Login Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/30 hover:bg-white/10 font-semibold rounded-xl transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
