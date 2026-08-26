"use client";

import { useEffect, useState } from "react";
import { Network, Users, Building2, User } from "lucide-react";

interface StructureItem {
  id: string;
  name: string;
  position: string;
  level: number;
  parentId: string | null;
  description?: string | null;
}

export default function StrukturPage() {
  const [structures, setStructures] = useState<StructureItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/structure")
      .then((res) => res.json())
      .then((data) => {
        setStructures(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Group by level for hierarchical display
  const structureByLevel = structures.reduce<Record<number, StructureItem[]>>((acc, item) => {
    if (!acc[item.level]) acc[item.level] = [];
    acc[item.level].push(item);
    return acc;
  }, {});

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-600 to-cyan-700 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Network className="w-16 h-16 mx-auto mb-4 text-teal-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Struktur Organisasi</h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto">
            Susunan organisasi dan pengurus terkini
          </p>
        </div>
      </section>

      {/* Structure Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-100 rounded-2xl" />
              ))}
            </div>
          ) : structures.length > 0 ? (
            <div className="space-y-6">
              {/* Top Level - Ketua */}
              {structureByLevel[1]?.map((item) => (
                <div key={item.id} className="text-center">
                  <div className="inline-block bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl px-8 py-6 shadow-lg shadow-blue-200 mb-4">
                    <Building2 className="w-8 h-8 mx-auto mb-2" />
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <p className="text-blue-200 text-sm mt-1">{item.position}</p>
                  </div>
                  
                  {/* Connector line */}
                  {Object.keys(structureByLevel).some(level => Number(level) > 1) && (
                    <div className="w-0.5 h-8 bg-blue-200 mx-auto" />
                  )}
                </div>
              ))}

              {/* Second Level */}
              {(structureByLevel[2]?.length || 0) > 0 && (
                <div className="relative">
                  <div className="border-t-2 border-dashed border-blue-200 pt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {structureByLevel[2]?.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-5 text-center hover:shadow-md transition-shadow"
                        >
                          <User className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <p className="text-sm text-emerald-600 font-medium">{item.position}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-2">{item.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Third Level - Divisions/Bidang */}
              {(structureByLevel[3]?.length || 0) > 0 && (
                <div className="mt-8">
                  <h3 className="text-center text-lg font-semibold text-gray-700 mb-6">Bidang-Bidang Kerja</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {structureByLevel[3]?.map((item) => (
                      <div
                        key={item.id}
                        className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center"
                      >
                        <Users className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                        <h5 className="font-medium text-gray-800 text-sm">{item.name}</h5>
                        <p className="text-xs text-orange-600">{item.position}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Levels */}
              {[4, 5].filter(l => (structureByLevel[l]?.length || 0) > 0).map((level) => (
                <div key={level} className="mt-8 space-y-3">
                  {structureByLevel[level]?.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 border border-gray-100 rounded-lg p-4 flex items-center gap-4"
                    >
                      <User className="w-6 h-6 text-gray-400 shrink-0" />
                      <div>
                        <h5 className="font-medium text-gray-800">{item.name}</h5>
                        <p className="text-sm text-gray-500">{item.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            /* Empty state with sample structure */
            <div className="text-center py-12">
              <Network className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Data Struktur</h3>
              <p className="text-gray-500 mb-6">
                Struktur organisasi akan ditampilkan di sini setelah data dimasukkan melalui dashboard admin.
              </p>
              
              {/* Sample Structure Preview */}
              <div className="max-w-md mx-auto text-left">
                <div className="text-center mb-6">
                  <div className="inline-block bg-blue-100 text-blue-800 rounded-xl px-6 py-4">
                    <Building2 className="w-6 h-6 mx-auto mb-1" />
                    <p className="font-semibold">Ketua</p>
                  </div>
                </div>
                
                <div className="border-t-2 border-dashed border-gray-200 pt-6">
                  <div className="grid grid-cols-3 gap-3">
                    {["Wakil Ketua", "Sekretaris", "Bendahara"].map((pos) => (
                      <div key={pos} className="bg-gray-100 rounded-lg p-3 text-center text-sm text-gray-600">
                        {pos}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
