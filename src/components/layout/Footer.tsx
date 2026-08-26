import Link from "next/link";
import { Heart, Mail, Phone, MapPin, Globe } from "lucide-react";
import { appConfig } from "@/lib/config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <h3 className="text-lg font-bold text-white">{appConfig.appName}</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {appConfig.appDescription}. Membantu organisasi Karang Taruna 
              mengelola data anggota, kegiatan, keuangan, dan dokumen dengan 
              mudah dan terintegrasi.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Menu Utama
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Beranda" },
                { href: "/profil", label: "Profil" },
                { href: "/visi-misi", label: "Visi & Misi" },
                { href: "/kegiatan", label: "Kegiatan" },
                { href: "/berita", label: "Berita & Pengumuman" },
                { href: "/galeri", label: "Galeri" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kontak Kami
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-sm">{appConfig.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-sm">{appConfig.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                <span className="text-sm">{appConfig.email}</span>
              </li>
            </ul>
          </div>

          {/* Dashboard Access */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Akses Dashboard
            </h4>
            <p className="text-sm text-gray-400 mb-4">
              Anggota Karang Taruna dapat login untuk mengakses dashboard 
              manajemen lengkap.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Login Dashboard
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-1">
            © {currentYear} {appConfig.appName}. Dibuat dengan
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            untuk Karang Taruna Indonesia.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300">Kebijakan Privasi</a>
            <span>|</span>
            <a href="#" className="hover:text-gray-300">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
