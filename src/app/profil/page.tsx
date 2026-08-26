"use client";

import {
  Users, Award, MapPin, Phone, Mail, Calendar,
  Target, Shield
} from "lucide-react";
import { appConfig } from "@/lib/config";

export default function ProfilPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-16 h-16 mx-auto mb-4 text-blue-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Profil Organisasi</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Mengenal lebih dekat {appConfig.organizationName}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Organization Info Card */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm mb-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                <span className="text-white text-5xl font-bold">KT</span>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{appConfig.organizationName}</h2>
                <p className="text-lg text-gray-600 mb-4">{appConfig.organizationShortName}</p>
                <p className="text-gray-500 leading-relaxed max-w-xl">
                  Karang Taruna adalah organisasi kemasyarakatan yang tumbuh dan berkembang 
                  atas dasar kesadaran dan rasa tanggung jawab sosial dari, oleh, dan untuk 
                  masyarakat khususnya generasi muda di wilayah desa atau kelurahan yang 
                  bersangkutan.
                </p>
              </div>
            </div>
          </div>

          {/* About Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <Target className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sejarah Singkat</h3>
              <p className="text-gray-600 leading-relaxed">
                {appConfig.organizationShortName} didirikan dengan semangat kebersamaan 
                dan tekad untuk memajukan generasi muda. Sejak awal berdirinya, organisasi 
                ini telah aktif dalam berbagai kegiatan pemberdayaan pemuda, pengembangan 
                potensi lokal, serta menjaga nilai-nilai gotong royong dan kepedulian sosial.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <Award className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pencapaian</h3>
              <ul className="space-y-3 text-gray-600">
                {[
                  "Juara 1 Lomba Desa Tingkat Kabupaten 2023",
                  "Penghargaan Organisasi Pemuda Teraktif",
                  "Program Pelatihan Kewirausahaan Sukses",
                  "Bakti Sosial Ramadhan Berkala Tahunan"
                ].map((achievement, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal Basis */}
          <div className="bg-yellow-50 rounded-2xl p-6 md:p-8 border border-yellow-100">
            <Shield className="w-10 h-10 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Dasar Hukum</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-2">
              <li>Undang-Undang Nomor 40 Tahun 2009 tentang Kepemudaan</li>
              <li>Peraturan Menteri Sosial RI tentang Pedoman Pembinaan Karang Taruna</li>
              <li>Anggaran Dasar dan Anggaran Rumah Tangga Karang Taruna</li>
              <li>Surat Keputusan Pembentukan Organisasi setempat</li>
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
