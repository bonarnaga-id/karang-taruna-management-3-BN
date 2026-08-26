import { z } from "zod";

// Login Validation
export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter")
});

export type LoginInput = z.infer<typeof loginSchema>;

// Member Validation
export const memberSchema = z.object({
  memberNumber: z.string().min(1, "Nomor anggota wajib diisi"),
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  birthPlace: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(["laki_laki", "perempuan"]).optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  education: z.string().optional(),
  occupation: z.string().optional(),
  skills: z.string().optional(),
  joinDate: z.string().optional(),
  status: z.enum(["aktif", "tidak_aktif", "pending", "dikeluarkan"]).default("pending")
});

export type MemberInput = z.infer<typeof memberSchema>;

// Activity Validation
export const activitySchema = z.object({
  title: z.string().min(3, "Nama kegiatan minimal 3 karakter"),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
  endDate: z.string().optional(),
  responsiblePerson: z.string().optional(),
  budget: z.string().optional(),
  status: z.enum(["rencana", "berlangsung", "selesai", "dibatalkan"]).default("rencana")
});

export type ActivityInput = z.infer<typeof activitySchema>;

// Financial Transaction Validation
export const financialTransactionSchema = z.object({
  date: z.string().min(1, "Tanggal wajib diisi"),
  type: z.enum(["pemasukan", "pengeluaran"]),
  category: z.string().min(1, "Kategori wajib diisi"),
  amount: z.string().min(1, "Nominal wajib diisi"),
  source: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "disetujui", "ditolak"]).default("pending")
});

export type FinancialTransactionInput = z.infer<typeof financialTransactionSchema>;

// Announcement Validation
export const announcementSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  content: z.string().min(10, "Konten minimal 10 karakter"),
  type: z.string().default("pengumuman"),
  isPublished: z.boolean().default(false)
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

// User/Account Validation
export const userSchema = z.object({
  email: z.string().email("Email tidak valid"),
  name: z.string().min(3, "Nama minimal 3 karakter"),
  role: z.enum(["super_admin", "admin", "ketua", "sekretaris", "bendahara", "koordinator", "anggota"]),
  isActive: z.boolean().default(true),
  memberId: z.string().optional()
});

export type UserInput = z.infer<typeof userSchema>;

// Password Change Validation
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Password saat ini minimal 6 karakter"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password harus mengandung huruf besar, kecil, dan angka"
  ),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"]
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
