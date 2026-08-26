"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Menu, X, Home, Users, Target, Network, Calendar, 
  Newspaper, Image, Phone, LogIn, ChevronDown 
} from "lucide-react";
import { appConfig } from "@/lib/config";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navLinks = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/profil", label: "Profil", icon: Users },
    { href: "/visi-misi", label: "Visi & Misi", icon: Target },
    { href: "/struktur", label: "Struktur", icon: Network },
    { href: "/kegiatan", label: "Kegiatan", icon: Calendar },
    { href: "/berita", label: "Berita", icon: Newspaper },
    { href: "/galeri", label: "Galeri", icon: Image },
    { href: "/kontak", label: "Kontak", icon: Phone },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{appConfig.appName}</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Karang Taruna Muda Berkarya</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="ml-4 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              Dashboard
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 mt-2 text-base font-medium text-white bg-blue-600 rounded-lg"
            >
              <LogIn className="w-5 h-5" />
              Login Dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
