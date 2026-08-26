# Karyuna — Sistem Manajemen Karang Taruna

Sistem manajemen lengkap untuk organisasi Karang Taruna dengan dashboard admin, manajemen anggota, struktur organisasi, kegiatan, keuangan, pengumuman, dokumen, dan sistem autentikasi berbasis JWT.

## Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Database | PostgreSQL (Neon) |
| ORM | Drizzle ORM |
| Auth | JWT + bcrypt |
| Styling | Tailwind CSS |
| Validasi | Zod |
| UI Icons | lucide-react |

## Fitur

### Halaman Publik
- **Beranda** — Ringkasan organisasi, kegiatan terbaru, pengumuman terbaru
- **Profil** — Sejarah, visi, misi, dan dasar hukum organisasi
- **Berita & Pengumuman** — Daftar berita dan pengumuman terpublikasi
- **Kegiatan** — Jadwal dan dokumentasi kegiatan (filter per status)
- **Galeri** — Foto-foto kegiatan organisasi
- **Struktur Organisasi** — Susunan pengurus secara hierarki
- **Visi & Misi** — Arah dan nilai organisasi
- **Hubungi Kami** — Formulir kontak dan informasi kontak

### Dashboard Admin
- **Manajemen Anggota** — CRUD anggota, filter status, pencarian
- **Struktur Organisasi** — Kelola posisi dan jabatan pengurus
- **Manajemen Kegiatan** — CRUD kegiatan, status tracking
- **Keuangan** — Transaksi kas, approve/tolak, laporan saldo
- **Dokumen** — Daftar dokumen terkait kegiatan
- **Surat** — (dalam pengembangan)
- **Pengumuman** — CRUD berita dan pengumuman
- **Audit Log** — Riwayat aktivitas sistem
- **Pengaturan** — Konfigurasi aplikasi dan widget dukungan

## Instalasi

### Prerequisites
- Node.js 18+
- npm
- Database PostgreSQL (rekomendasi: Neon)

### Setup

```bash
# Clone repository
git clone <repo-url>
cd karang-taruna-management

# Install dependencies
npm install

# Salin .env.example dan sesuaikan
cp .env.example .env.local
```

### Environment Variables

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://user:pass@host/db?sslmode=require` |
| `JWT_SECRET` | Secret key untuk JWT token | `your-super-secret-jwt-key` |
| `APP_NAME` | Nama aplikasi | `Karyuna` |
| `APP_DOMAIN` | Domain aplikasi | `http://localhost:3000` |
| `ORG_NAME` | Nama organisasi | `Karang Taruna Desa Muda Berkarya` |
| `ORG_EMAIL` | Email organisasi | `karangtaruna@desamaju.id` |
| `ORG_PHONE` | Telepon organisasi | `+62812-3456-7890` |

## Database

### Migration

```bash
# Generate migration dari schema
npx drizzle-kit generate

# Apply migration ke database
npx drizzle-kit migrate

# Atau push schema langsung (untuk development)
npx drizzle-kit push
```

### Seed Data

```bash
# Seed database dengan data contoh
npx tsx src/db/seed.ts
```

### Schema Overview

Database menggunakan 12 tabel:

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Pengguna dengan peran (super_admin, admin, ketua, dll) |
| `members` | Data anggota Karang Taruna |
| `organization_structure` | Struktur organisasi dan posisi |
| `activities` | Kegiatan dan event organisasi |
| `announcements` | Berita dan pengumuman |
| `financial_transactions` | Transaksi keuangan |
| `documents` | Dokumen terkait kegiatan |
| `gallery` | Galeri foto kegiatan |
| `notifications` | Notifikasi untuk pengguna |
| `audit_logs` | Log aktivitas sistem |
| `app_settings` | Pengaturan aplikasi |
| `attendance` | Presensi kegiatan |

## Development

```bash
# Development server
npm run dev

# Build
npm run build

# Lint
npm run lint

# TypeScript check
npm run typecheck
```

## Deployment

### Vercel

1. **Connect repository** ke Vercel
2. **Set Environment Variables** di Project Settings → Environment Variables:
   ```
   DATABASE_URL = postgresql://neondb_owner:npg_...@ep-...neon.tech/neondb?sslmode=require
   JWT_SECRET   = *(generate secure secret)*
   ```
3. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Database setup** (run sekali setelah deploy pertama):
   ```bash
   npx drizzle-kit generate
   npx drizzle-kit migrate
   npx tsx src/db/seed.ts
   ```

### Windows PowerShell Note

Gunakan `;` pemisah perintah di PowerShell 5.1 (bukan `&&`):

```powershell
$env:DATABASE_URL="..."; npx drizzle-kit migrate; if ($?) { npx tsx src/db/seed.ts }
```

## User Roles & Permissions

| Role | manage_users | manage_members | manage_structure | manage_activities | manage_documents | manage_finance | manage_announcements | approve_activities | approve_transactions | view_audit_log |
|------|-------------|----------------|-------------------|--------------------|-------------------|-----------------|----------------------|---------------------|----------------------|-----------------|
| super_admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| admin | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| ketua | — | ✓ | ✓ | — | — | — | — | ✓ | — | — |
| sekretaris | — | ✓ | ✓ | — | — | — | — | — | — | — |
| bendahara | — | ✓ | — | — | — | ✓ | — | — | ✓ | — |
| koordinator | — | ✓ | ✓ | ✓ (bidang) | — | — | — | — | — | — |
| anggota | — | — | — | ✓ (view) | — | — | — | — | — | — |

## Default Credentials (Seed Data)

| Email | Password | Role |
|-------|----------|------|
| admin@karyuna.id | admin123 | Super Admin |
| ketua@karyuna.id | admin123 | Ketua |
| sekretaris@karyuna.id | admin123 | Sekretaris |
| bendahara@karyuna.id | admin123 | Bendahara |
| koordinator@karyuna.id | admin123 | Koordinator |
| anggota1@karyuna.id | admin123 | Anggota |
| anggota2@karyuna.id | admin123 | Anggota |

## API Endpoints

### Auth
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| POST | `/api/auth/login` | ✗ | Login dengan email + password |
| POST | `/api/auth/logout` | ✓ | Logout (clear cookie) |
| GET | `/api/auth/session` | ✗ | Cek session user |

### Public
| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/health` | ✗ | Health check database |
| GET | `/api/activities` | ✗ | Daftar kegiatan (publik) |
| GET | `/api/announcements` | ✗ | Daftar pengumuman (publik) |
| GET | `/api/structure` | ✗ | Struktur organisasi (publik) |
| GET | `/api/gallery` | ✗ | Galeri foto |
| POST | `/api/contact` | ✗ | Kirim pesan kontak |

### Protected (Admin)
| Method | Endpoint | Permission | Deskripsi |
|--------|----------|------------|-----------|
| GET/POST | `/api/members` | manage_members | Kelola data anggota |
| PUT/DELETE | `/api/members/[id]` | manage_members | Edit/hapus anggota |
| GET/POST | `/api/structure` | manage_structure | Kelola struktur |
| PUT | `/api/structure` | manage_structure | Update posisi |
| GET/POST | `/api/activities` | manage_activities | Kelola kegiatan |
| PUT/DELETE | `/api/activities/[id]` | manage_activities | Edit/hapus kegiatan |
| GET/POST | `/api/finance` | manage_finance | Kelola transaksi |
| PATCH | `/api/finance/[id]` | approve_transactions | Approve/tolak |
| GET | `/api/documents` | view_documents | Daftar dokumen |
| POST | `/api/documents` | manage_documents | Upload dokumen |
| GET | `/api/audit/logs` | view_audit_log | Riwayat audit |
| GET | `/api/settings` | — | Pengaturan aplikasi |
| PUT | `/api/settings` | — | Update pengaturan |
| GET | `/api/notifications` | — | Notifikasi user |
| GET | `/api/users` | manage_users | Kelola pengguna |
| PUT/DELETE | `/api/users/[id]` | manage_users | Edit/hapus pengguna |

## Project Structure

```
src/
├── app/
│   ├── api/              # API routes (App Router)
│   │   ├── auth/         # Login, logout, session
│   │   ├── activities/   # CRUD kegiatan
│   │   ├── members/      # CRUD anggota
│   │   ├── structure/    # Kelola struktur organisasi
│   │   ├── finance/      # Transaksi keuangan
│   │   ├── announcements/# CRUD pengumuman
│   │   ├── documents/    # Manajemen dokumen
│   │   ├── gallery/      # Galeri foto
│   │   ├── notifications/# Notifikasi
│   │   ├── settings/     # Pengaturan aplikasi
│   │   ├── audit/logs/   # Audit log
│   │   ├── health/       # Health check
│   │   └── users/        # Kelola pengguna
│   ├── dashboard/        # Dashboard admin pages
│   │   ├── anggota/      # Manajemen anggota
│   │   │   ├── tambah/    # Tambah anggota baru
│   │   │   └── [id]/edit/ # Edit data anggota
│   │   ├── struktur/     # Manajemen struktur organisasi
│   │   ├── kegiatan/     # Manajemen kegiatan
│   │   │   ├── tambah/   # Tambah kegiatan baru
│   │   │   └── [id]/edit/ # Edit data kegiatan
│   │   ├── keuangan/     # Manajemen keuangan
│   │   │   ├── tambah/   # Catat transaksi baru
│   │   │   └── [id]/edit/ # Edit transaksi
│   │   ├── dokumen/      # Manajemen dokumen
│   │   ├── surat/        # Halaman surat (coming soon)
│   │   ├── pengumuman/   # Manajemen pengumuman
│   │   │   └── tambah/   # Buat pengumuman baru
│   │   ├── audit-log/    # Audit log viewer
│   │   ├── pengaturan/   # Pengaturan aplikasi
│   │   ├── layout.tsx    # Layout dengan sidebar navigasi
│   │   └── page.tsx      # Dashboard homepage
│   ├── berita/           # Public news page
│   ├── galeri/           # Public gallery page
│   ├── kegiatan/         # Public activities page
│   ├── kontak/           # Public contact page
│   ├── login/            # Login page
│   ├── profil/           # Public profile page
│   ├── struktur/         # Public structure page
│   ├── visi-misi/        # Public vision & mission page
│   ├── globals.css       # Tailwind imports + custom CSS
│   └── layout.tsx        # Root layout
├── db/
│   ├── schema.ts         # Drizzle schema (12 tables)
│   ├── index.ts          # Database connection
│   └── migrations/       # Generated SQL migrations
├── lib/
│   ├── auth.ts           # JWT utilities
│   ├── auth-middleware.ts # Auth middleware + permissions
│   ├── audit.ts          # Audit logging
│   ├── config.ts         # App configuration
│   ├── validations.ts    # Zod validation schemas
│   └── utils.ts          # Helper utilities
└── components/           # Reusable components
```

## License

This project is licensed under the MIT License.
