"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Network,
  Calendar,
  DollarSign,
  FileText,
  Newspaper,
  ClipboardList,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Shield
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  {
    label: "Dasbor",
    href: "/dashboard",
    icon: LayoutDashboard
  },
  {
    label: "Anggota",
    href: "/dashboard/anggota",
    icon: Users
  },
  {
    label: "Struktur Organisasi",
    href: "/dashboard/struktur",
    icon: Network
  },
  {
    label: "Kegiatan",
    href: "/dashboard/kegiatan",
    icon: Calendar,
    children: [
      { label: "Daftar Kegiatan", href: "/dashboard/kegiatan" },
      { label: "Kalender", href: "/dashboard/kalender" },
      { label: "Presensi", href: "/dashboard/presensi" }
    ]
  },
  {
    label: "Keuangan",
    href: "/dashboard/keuangan",
    icon: DollarSign,
    children: [
      { label: "Transaksi", href: "/dashboard/keuangan" },
      { label: "Laporan Keuangan", href: "/dashboard/laporan-keuangan" }
    ]
  },
  {
    label: "Dokumen",
    href: "/dashboard/dokumen",
    icon: FileText
  },
  {
    label: "Pengumuman",
    href: "/dashboard/pengumuman",
    icon: Newspaper
  },
  {
    label: "Surat",
    href: "/dashboard/surat",
    icon: Mail
  },
  {
    label: "Audit Log",
    href: "/dashboard/audit-log",
    icon: ClipboardList
  },
  {
    label: "Pengaturan",
    href: "/dashboard/pengaturan",
    icon: Settings
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");
  
  const NavLink = ({ item }: { item: NavItem }) => (
    <div>
      <button
        type="button"
        onClick={() => {
          if (item.children) {
            setActiveDropdown(activeDropdown === item.label ? null : item.label);
          } else {
            setSidebarOpen(false);
            router.push(item.href);
          }
        }}
        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive(item.href)
            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <span className="flex items-center gap-3">
          <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-white" : "text-gray-400"}`} />
          {item.label}
        </span>
        {item.children && (
          <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === item.label ? "rotate-180" : ""}`} />
        )}
      </button>
      
      {/* Dropdown submenu */}
      {item.children && activeDropdown === item.label && (
        <div className="ml-8 mt-1 space-y-1">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={() => setSidebarOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm ${
                pathname === child.href
                  ? "text-blue-600 font-medium bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-y-auto`}>
        <div className="flex flex-col h-full">
          {/* Logo / Brand */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Karyuna</h2>
                <p className="text-xs text-gray-500">Dashboard Admin</p>
              </div>
            </Link>
            
            {/* Close button (mobile only) */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* User Section at Bottom */}
          <div className="p-4 border-t border-gray-100 space-y-2 shrink-0">
            <Link
              href="/dashboard/pengaturan"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5 text-gray-400" />
              Pengaturan Akun
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Buka menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Breadcrumb placeholder - can be enhanced later */}
            <h1 className="hidden sm:block text-lg font-semibold text-gray-800 capitalize">
              {pathname.split("/").pop()?.replace(/-/g, " ") || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications button */}
            <button
              type="button"
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            {/* User avatar */}
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
