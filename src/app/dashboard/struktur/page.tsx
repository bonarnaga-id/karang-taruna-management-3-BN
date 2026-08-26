"use client";

import { useCallback, useEffect, useState } from "react";
import { Network, Plus, Edit2, X } from "lucide-react";

interface StructureItem {
  id: string;
  name: string;
  position: string;
  parentId: string | null;
  level: number;
  memberId: string | null;
  description: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const levelNames: Record<number, string> = {
  1: "Ketua/Pimpinan",
  2: "Wakil & Sekretaris & Bendahara",
  3: "Bidang/Porwasi",
  4: "Sub-Bidang",
  5: "Anggota Bidang"
};

export default function StrukturDashboardPage() {
  const [structures, setStructures] = useState<StructureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<StructureItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<StructureItem>>({});

  const fetchStructures = useCallback(() => {
    fetch("/api/structure")
      .then((res) => res.json())
      .then((data) => {
        setStructures(data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchStructures(); }, [fetchStructures]);

  const handleAdd = async () => {
    if (!formData.name || !formData.position) return;
    try {
      const res = await fetch("/api/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          position: formData.position,
          parentId: formData.parentId || null,
          level: formData.level || 1,
          memberId: formData.memberId || null,
          description: formData.description || "",
          order: formData.order || 0
        })
      });
      if (res.ok) {
        setShowAddForm(false);
        setFormData({});
        setLoading(true);
        fetchStructures();
      }
    } catch {}
  };

  const handleEdit = async () => {
    if (!editingItem || !editingItem.name || !editingItem.position) return;
    try {
      const res = await fetch("/api/structure", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          name: editingItem.name,
          position: editingItem.position,
          parentId: editingItem.parentId,
          level: editingItem.level,
          memberId: editingItem.memberId,
          description: editingItem.description,
          order: editingItem.order
        })
      });
      if (res.ok) {
        setEditingItem(null);
        setLoading(true);
        fetchStructures();
      }
    } catch {}
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Struktur Organisasi</h2>
          <p className="text-gray-500 mt-1">Kelola susunan organisasi dan posisi pengurus</p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setFormData({}); }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" /> Tambah Posisi
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Tambah Posisi Baru</h3>
              <button
                onClick={() => { setShowAddForm(false); setFormData({}); }}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama*</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posisi/Jabatan*</label>
                <input
                  type="text"
                  value={formData.position || ""}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={formData.level || 1}
                  onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5].map((l) => (
                    <option key={l} value={l}>{levelNames[l] || `Level ${l}`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
                <select
                  value={formData.parentId || ""}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value || null })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tidak ada (Level 1)</option>
                  {structures.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - {item.position} (Level {item.level})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Deskripsi posisi..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                <input
                  type="number"
                  value={formData.order || 0}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => { setShowAddForm(false); setFormData({}); }}
                className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Edit Posisi</h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama*</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posisi/Jabatan*</label>
                <input
                  type="text"
                  value={editingItem.position}
                  onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                <select
                  value={editingItem.level}
                  onChange={(e) => setEditingItem({ ...editingItem, level: parseInt(e.target.value) })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[1, 2, 3, 4, 5].map((l) => (
                    <option key={l} value={l}>{levelNames[l] || `Level ${l}`}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent</label>
                <select
                  value={editingItem.parentId || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, parentId: e.target.value || null })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tidak ada (Level 1)</option>
                  {structures
                    .filter((item) => item.id !== editingItem.id)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} - {item.position} (Level {item.level})
                      </option>
                    ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={editingItem.description || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Deskripsi posisi..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                <input
                  type="number"
                  value={editingItem.order}
                  onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Structure Hierarchy */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : structures.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Level", "Nama", "Posisi", "Parent", "Deskripsi", "Urutan", "Aksi"].map((h) => (
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
                {structures
                  .sort((a, b) => a.level - b.level || a.order - b.order)
                  .map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.level === 1
                              ? "bg-purple-100 text-purple-700"
                              : item.level === 2
                              ? "bg-blue-100 text-blue-700"
                              : item.level === 3
                              ? "bg-emerald-100 text-emerald-700"
                              : item.level === 4
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          Level {item.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-gray-600">{item.position}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.parentId
                          ? structures.find((s) => s.id === item.parentId)?.name || "-"
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {item.description || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-500">{item.order}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingItem(item)}
                            className="p-2 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4 text-blue-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Network className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-1">Belum Ada Struktur Organisasi</h3>
            <p className="text-gray-500 mb-4">Mulai tambahkan posisi struktur pertama Anda</p>
            <button
              onClick={() => { setShowAddForm(true); setFormData({}); }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl"
            >
              <Plus className="w-5 h-5" /> Tambah Posisi Pertama
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
