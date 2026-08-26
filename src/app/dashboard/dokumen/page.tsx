"use client";

import { useEffect, useState } from "react";
import { FileText, Search, Filter, Download } from "lucide-react";

interface Document {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  fileSize?: string | null;
  fileType?: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

const docTypeLabels: Record<string, string> = {
  proposal: "Proposal",
  laporan: "Laporan",
  surat_masuk: "Surat Masuk",
  surat_keluar: "Surat Keluar",
  dokumen_lain: "Lainnya"
};

export default function DokumenPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (typeFilter) params.set("type", typeFilter);
    if (search) params.set("search", search);

    fetch(`/api/documents?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setDocuments(data.data);
        }
        if (data.error) {
          console.error(data.error);
        }
      })
      .finally(() => setLoading(false));
  }, [typeFilter, search]);

  const handleSearch = () => {
    // Trigger refetch by changing state
    setSearch(search);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dokumen</h2>
          <p className="text-gray-500 mt-1">Kelola dokumen terkait kegiatan dan organisasi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari dokumen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Tipe</option>
              {Object.entries(docTypeLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium"
          >
            Cari
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Tipe", "Judul", "Deskripsi", "Tanggal", "Aksi"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        doc.type === "surat_masuk" || doc.type === "surat_keluar"
                          ? "bg-blue-100 text-blue-700"
                          : doc.type === "proposal"
                          ? "bg-purple-100 text-purple-700"
                          : doc.type === "laporan"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {docTypeLabels[doc.type] || doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{doc.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {doc.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" /> Unduh
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Belum Ada Dokumen</h3>
            <p className="text-gray-500">Dokumen akan ditampilkan di sini setelah ditambahkan</p>
          </div>
        )}
      </div>
    </div>
  );
}
