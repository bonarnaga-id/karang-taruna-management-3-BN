"use client";

import { useEffect, useState } from "react";
import { Newspaper, FileText, Megaphone } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt: string;
}

export default function BeritaPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements?limit=20")
      .then((res) => res.json())
      .then((data) => {
        setAnnouncements(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Newspaper className="w-16 h-16 mx-auto mb-4 text-indigo-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Berita & Pengumuman</h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            Informasi terbaru dan pengumuman penting dari organisasi
          </p>
        </div>
      </section>

      {/* News Content */}
      <section className="py-12 md:py-20 bg-gray-50 min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="space-y-6 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6">
                  <div className="flex gap-3 mb-3">
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    <div className="h-6 w-24 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-3" />
                  <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : announcements.length > 0 ? (
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <article
                  key={announcement.id}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                >
                  <header className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      announcement.type === "berita"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {announcement.type === "berita" ? (
                        <FileText className="w-3.5 h-3.5" />
                      ) : (
                        <Megaphone className="w-3.5 h-3.5" />
                      )}
                      {announcement.type === "berita" ? "Berita" : "Pengumuman"}
                    </span>
                    
                    <time dateTime={announcement.createdAt} className="text-xs text-gray-400">
                      {formatDateTime(announcement.createdAt)}
                    </time>
                  </header>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {announcement.title}
                  </h2>
                  
                  <p className="text-gray-600 leading-relaxed line-clamp-4">
                    {announcement.content}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                      Baca selengkapnya →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="text-center py-16 bg-white rounded-2xl">
              <Newspaper className="w-20 h-20 mx-auto text-gray-300 mb-4" />
              <h3 className="text-2xl font-semibold text-gray-600 mb-2">Belum Ada Berita</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Berita dan pengumuman akan ditampilkan di sini setelah admin menerbitkannya.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
