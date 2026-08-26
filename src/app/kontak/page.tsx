"use client";

import { useState } from "react";
import { 
  Phone, Mail, MapPin, Clock, Send, MessageSquare,
  Globe, Camera, Video
} from "lucide-react";
import { appConfig } from "@/lib/config";

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Phone className="w-16 h-16 mx-auto mb-4 text-green-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Jangan ragu untuk menghubungi kami jika ada pertanyaan atau ingin berkolaborasi
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Alamat</h3>
                    <p className="text-sm text-gray-600 mt-1">{appConfig.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Telepon</h3>
                    <a href={`tel:${appConfig.phone}`} className="text-sm text-gray-600 hover:text-green-600 mt-1 block">
                      {appConfig.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a href={`mailto:${appConfig.email}`} className="text-sm text-gray-600 hover:text-purple-600 mt-1 block">
                      {appConfig.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Jam Operasional</h3>
                    <p className="text-sm text-gray-600 mt-1">Senin - Sabtu</p>
                    <p className="text-sm text-gray-500">08.00 - 17.00 WIB</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Media Sosial</h3>
                <div className="flex gap-3">
                  {[
                    { icon: Globe, label: "Facebook", color: "hover:bg-blue-500" },
                    { icon: Camera, label: "Instagram", color: "hover:bg-pink-500" },
                    { icon: Video, label: "YouTube", color: "hover:bg-red-500" }
                  ].map((social) => (
                    <button
                      key={social.label}
                      type="button"
                      className={`w-11 h-11 rounded-xl bg-gray-100 ${social.color} hover:text-white transition-colors flex items-center justify-center`}
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Kirim Pesan</h2>
                </div>

                {submitted ? (
                  <div className="text-center py-12 animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pesan Terkirim!</h3>
                    <p className="text-gray-600 mb-6">
                      Terima kasih telah menghubungi kami. Kami akan membalas pesan Anda secepatnya.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Kirim Pesan Lagi
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Nama Lengkap *
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="Masukkan nama lengkap Anda"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email *
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          placeholder="nama@email.com"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Subjek
                      </label>
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white"
                      >
                        <option value="">Pilih subjek</option>
                        <option value="info">Informasi Umum</option>
                        <option value="membership">Keanggotaan</option>
                        <option value="cooperation">Kerja Sama</option>
                        <option value="complaint">Keluhan/Saran</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Pesan *
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Tulis pesan Anda di sini..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition-colors shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Kirim Pesan
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 h-[400px] flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Peta Lokasi</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {appConfig.address}
              </p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Buka di Google Maps
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
