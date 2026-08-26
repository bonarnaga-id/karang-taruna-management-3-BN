// Konfigurasi Terpusat Karyuna
// Semua pengaturan aplikasi dapat diubah dari sini

export const appConfig = {
  // Informasi Aplikasi
  appName: process.env.APP_NAME || "Karyuna",
  appDescription: "Sistem Manajemen Organisasi Karang Taruna",
  version: "1.0.0",
  
  // Informasi Organisasi
  organizationName: process.env.ORG_NAME || "Karang Taruna Desa Muda Berkarya",
  organizationShortName: "KT Muda Berkarya",
  
  // Kontak
  address: process.env.ORG_ADDRESS || "Jl. Pemuda No. 123, Desa Maju, Kecamatan Sejahtera, Kabupaten Makmur",
  email: process.env.ORG_EMAIL || "karangtaruna@desamaju.id",
  phone: process.env.ORG_PHONE || "+62812-3456-7890",
  
  // Domain & URL
  domain: process.env.APP_DOMAIN || "http://localhost:3000",
  
  // Warna Utama (dalam format Tailwind)
  primaryColor: "blue",
  secondaryColor: "emerald",
  
  // Logo & Favicon
  logoUrl: "/logo.svg",
  faviconUrl: "/favicon.ico",
  
  // Widget Support / Traktiran
  supportWidgetEnabled: process.env.VITE_SUPPORT_WIDGET_ENABLED === "true" || true,
  supportRecipientName: process.env.VITE_SUPPORT_RECIPIENT_NAME || "Perpus Opera",
  supportQrImageUrl: process.env.VITE_SUPPORT_QR_IMAGE_URL || "/assets/qr-traktiran.png",
  supportPageUrl: process.env.VITE_SUPPORT_PAGE_URL || "https://trakteer.id/perpus_opera/",
  supportAmounts: ["6000", "12000", "18000", "24000", "30000"],
  supportLabel: "Web app ini gratis & bebas iklan. Kopi kecil, server tetap jalan",
  
  // Visi Misi
  vision: "Mewujudkan generasi muda yang kreatif, inovatif, dan berdedikasi tinggi untuk kemajuan desa dan bangsa.",
  
  missions: [
    "Meningkatkan kapasitas dan kompetensi pemuda melalui pelatihan dan pendidikan non-formal",
    "Membangun kewirausahaan pemuda untuk kemandirian ekonomi",
    "Melestarikan seni dan budaya daerah melalui kegiatan kreatif",
    "Menjaga keharmonisan sosial dan lingkungan hidup",
    "Membangun jaringan kerjasama dengan organisasi kemasyarakatan lainnya"
  ],
  
  // Pagination
  defaultPageSize: 10,
  
  // File Upload Limits
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ["image/jpeg", "image/png", "image/gif", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  
  // Role Permissions Map
  permissions: {
    super_admin: [
      "manage_users", "manage_members", "manage_structure", "manage_activities",
      "manage_finances", "view_finances", "approve_transactions", "manage_documents",
      "manage_announcements", "manage_settings", "view_audit_log",
      "manage_attendance", "manage_notifications"
    ],
    admin: [
      "manage_members", "manage_structure", "manage_activities",
      "view_finances", "manage_documents", "manage_announcements",
      "manage_attendance", "manage_notifications"
    ],
    ketua: [
      "view_members", "view_structure", "approve_activities", "approve_finances",
      "view_reports", "manage_announcements", "view_attendance"
    ],
    sekretaris: [
      "view_members", "manage_activities", "manage_documents",
      "manage_announcements", "manage_attendance", "manage_notifications"
    ],
    bendahara: [
      "view_members", "manage_finances", "view_finances", "approve_transactions",
      "view_financial_reports", "manage_notifications"
    ],
    koordinator: [
      "view_members_bidang", "manage_activities_bidang", "view_attendance_bidang",
      "manage_notifications"
    ],
    anggota: [
      "view_profile", "edit_own_profile", "view_activities",
      "view_announcements", "mark_attendance"
    ]
  }
};

export type AppConfig = typeof appConfig;
