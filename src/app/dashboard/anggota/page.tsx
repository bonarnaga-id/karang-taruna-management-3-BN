"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, Search, Edit2, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";

interface Member {
  id: string;
  memberNumber: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  joinDate?: string | null;
}

export default function AnggotaPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMembers = useCallback(() => {
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    fetch(`/api/members?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setMembers(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .finally(() => setLoading(false));
  }, [page, search, statusFilter]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus anggota ini?")) return;
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    setLoading(true);
    fetchMembers();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manajemen Anggota</h2>
          <p className="text-gray-500 mt-1">Kelola data anggota Karang Taruna</p>
        </div>
        <Link href="/dashboard/anggota/tambah" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
          <Plus className="w-5 h-5" /> Tambah Anggota
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau nomor anggota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (setLoading(true), fetchMembers())}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none"
          >
            <option value="">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="tidak_aktif">Tidak Aktif</option>
            <option value="pending">Pending</option>
            <option value="dikeluarkan">Dikeluarkan</option>
          </select>
          <button onClick={() => { setLoading(true); fetchMembers(); }} className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium">Cari</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-lg" />)}</div>
        ) : members.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["No", "Nomor Anggota", "Nama", "Telepon", "Status", "Aksi"].map(h => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {members.map((member, i) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * 10 + i + 1}</td>
                      <td className="px-6 py-4 font-mono text-sm font-medium">{member.memberNumber}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{member.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{member.phone || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                          member.status === "aktif" ? "bg-green-100 text-green-700" :
                          member.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"
                        }`}>{member.status.replace("_", " ")}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button type="button" className="p-2 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4 text-gray-400" /></button>
                          <Link href={`/dashboard/anggota/${member.id}/edit`} className="p-2 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4 text-blue-500" /></Link>
                          <button type="button" onClick={() => handleDelete(member.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">Halaman {page} dari {totalPages}</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} type="button" onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>{i + 1}</button>
                  ))}
                  <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-16 text-center">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Belum Ada Data Anggota</h3>
            <p className="text-gray-500 mb-4">Mulai tambahkan anggota pertama Anda</p>
            <Link href="/dashboard/anggota/tambah" className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl">
              <Plus className="w-5 h-5" /> Tambah Anggota Pertama
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
