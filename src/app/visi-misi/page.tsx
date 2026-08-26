"use client";

import { Target, Eye, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { appConfig } from "@/lib/config";

export default function VisiMisiPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-48 h-48 border-4 border-white rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <Target className="w-16 h-16 mx-auto mb-4 text-purple-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Visi & Misi</h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Arah dan tujuan organisasi kami untuk masa depan yang lebih baik
          </p>
        </div>
      </section>

      {/* Vision & Mission Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Vision */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg shadow-blue-200">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Visi</h2>
                <p className="text-gray-500">Arah pandangan ke depan</p>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 border border-blue-100">
              <blockquote className="text-xl md:text-2xl leading-relaxed text-gray-800 italic text-center">
                &ldquo;{appConfig.vision}&rdquo;
              </blockquote>
              <div className="mt-6 flex justify-center">
                <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Mission */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl shadow-lg shadow-emerald-200">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Misi</h2>
                <p className="text-gray-500">Langkah-langkah konkret untuk mencapai visi</p>
              </div>
            </div>

            <div className="grid gap-4">
              {appConfig.missions.map((mission, index) => (
                <div
                  key={index}
                  className="group flex gap-4 p-6 bg-gray-50 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 rounded-2xl transition-all duration-300 border border-transparent hover:border-emerald-100"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <CheckCircle className="w-5 h-5 text-emerald-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 pt-1">
                    <span className="font-semibold text-gray-800 group-hover:text-emerald-800">
                      Misi {index + 1}:
                    </span>{" "}
                    <span className="text-gray-600 leading-relaxed">{mission}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Nilai-Nilai Kami</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Kebersamaan", emoji: "🤝", desc: "Gotong royong dan kerja sama tim" },
              { title: "Integritas", emoji: "💎", desc: "Jujur, amanah, dan bertanggung jawab" },
              { title: "Inovasi", emoji: "💡", desc: "Kreatif dan selalu berinovasi" },
              { title: "Dedikasi", emoji: "❤️", desc: "Totalitas dalam berorganisasi" }
            ].map((value) => (
              <div key={value.title} className="text-center bg-white rounded-2xl p-6 shadow-sm">
                <div className="text-4xl mb-3">{value.emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
                <p className="text-sm text-gray-500">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
