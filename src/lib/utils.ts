import { type ClassValue, clsx } from "clsx";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// Format mata uang Rupiah
export function formatRupiah(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

// Format tanggal Indonesia
export function formatDate(dateString: string, formatStr: string = "dd MMMM yyyy"): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, formatStr, { locale: idLocale });
  } catch {
    return dateString;
  }
}

// Format tanggal waktu
export function formatDateTime(dateString: string): string {
  return formatDate(dateString, "dd MMMM yyyy HH:mm");
}

// Generate nomor anggota otomatis
export function generateMemberNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `KT-${year}-${random}`;
}

// Truncate teks
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Initial nama
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Validasi email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Slug dari string
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Status badge colors
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    aktif: "bg-green-100 text-green-800",
    tidak_aktif: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    dikeluarkan: "bg-red-100 text-red-800",
    rencana: "bg-blue-100 text-blue-800",
    berlangsung: "bg-indigo-100 text-indigo-800",
    selesai: "bg-green-100 text-green-800",
    dibatalkan: "bg-red-100 text-red-800",
    pemasukan: "bg-emerald-100 text-emerald-800",
    pengeluaran: "bg-orange-100 text-orange-800",
    disetujui: "bg-green-100 text-green-800",
    ditolak: "bg-red-100 text-red-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

// Role label
export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin Organisasi",
    ketua: "Ketua",
    sekretaris: "Sekretaris",
    bendahara: "Bendahara",
    koordinator: "Koordinator Bidang",
    anggota: "Anggota"
  };
  return labels[role] || role;
}
