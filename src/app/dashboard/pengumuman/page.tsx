"use client";

import { useEffect, useState } from "react";
import { Plus, Newspaper, Edit2, Trash2, Send } from "lucide-react";
import Link from "next/link";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  isPublished: boolean;
  createdAt: string;
}

export default function PengumumanPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((d) => { setItems(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pengumuman</h2>
          <p className="text-gray-500 mt-1">Kelola berita dan pengumuman organisasi</p>
        </div>
        <Link href="/dashboard/pengumuman/tambah" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors">
          <Plus className="w-5 h-5" /> Buat Pengumuman
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-lg" />)}</div>
        ) : items.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {items.map(item => (
              <div key={item.id} className="px-6 py-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {item.isPublished ? 'Diterbitkan' : 'Draft'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.type === 'berita' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(item.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Link href={`/dashboard/pengumuman/${item.id}/edit`} className="p-2 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4 text-blue-500" /></Link>
                  <button type="button" onClick={async () => {
                    await fetch(`/api/announcements/${item.id}`, { method: "DELETE" });
                    setItems(items.filter(i => i.id !== item.id));
                  }} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Newspaper className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Belum Ada Pengumuman</h3>
            <Link href="/dashboard/pengumuman/tambah" className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl mt-4">
              <Plus className="w-5 h-5" /> Buat Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
