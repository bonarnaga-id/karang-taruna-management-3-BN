import { db } from "@/db";
import { users, members, organizationStructure, activities, announcements, appSettings } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { randomUUID } from "crypto";

async function seed() {
  console.log("🌱 Memulai seed data Karyuna...\n");

  const hashedPassword = await hashPassword("admin123");
  const adminId = randomUUID();
  
  // 1. Create default Super Admin
  const [admin] = await db.insert(users).values({
    id: adminId,
    email: "admin@karyuna.id",
    password: hashedPassword,
    name: "Administrator Utama",
    role: "super_admin",
    isActive: true
  }).returning();
  
  console.log("✅ User admin dibuat:", admin.email);

  // Create sample users with different roles
  await db.insert(users).values([
    { id: randomUUID(), email: "ketua@karyuna.id", password: hashedPassword, name: "Ahmad Fauzi", role: "ketua" },
    { id: randomUUID(), email: "sekretaris@karyuna.id", password: hashedPassword, name: "Siti Nurhaliza", role: "sekretaris" },
    { id: randomUUID(), email: "bendahara@karyuna.id", password: hashedPassword, name: "Budi Santoso", role: "bendahara" },
    { id: randomUUID(), email: "koordinator@karyuna.id", password: hashedPassword, name: "Dewi Lestari", role: "koordinator" },
    { id: randomUUID(), email: "anggota1@karyuna.id", password: hashedPassword, name: "Rizky Pratama", role: "anggota" },
    { id: randomUUID(), email: "anggota2@karyuna.id", password: hashedPassword, name: "Maya Sari", role: "anggota" }
  ]);

  console.log("✅ 6 user sampel dibuat");

  // 2. Create sample members
  const memberData = [
    { id: randomUUID(), memberNumber: "KT-2024-001", fullName: "Ahmad Fauzi", birthPlace: "Jakarta", birthDate: "1995-03-15", gender: "laki_laki" as const, address: "Jl. Mawar No. 10, Desa Maju", phone: "081234567890", email: "ahmad.fauzi@email.com", education: "S1 Manajemen", occupation: "Wirausaha", skills: "Kepemimpinan, Public Speaking", joinDate: "2020-01-15", status: "aktif" as const },
    { id: randomUUID(), memberNumber: "KT-2024-002", fullName: "Siti Nurhaliza", birthPlace: "Bandung", birthDate: "1997-07-22", gender: "perempuan" as const, address: "Jl. Melati No. 5, Desa Maju", phone: "082345678901", email: "siti.nur@email.com", education: "S1 Administrasi", occupation: "PNS", skills: "Admin, Komunikasi", joinDate: "2020-01-15", status: "aktif" as const },
    { id: randomUUID(), memberNumber: "KT-2024-003", fullName: "Budi Santoso", birthPlace: "Surabaya", birthDate: "1993-11-08", gender: "laki_laki" as const, address: "Jl. Anggrek No. 12, Desa Makmur", phone: "083456789012", email: "budi.santoso@email.com", education: "D3 Akuntansi", occupation: "Pedagang", skills: "Akuntansi, Keuangan", joinDate: "2021-03-10", status: "aktif" as const },
    { id: randomUUID(), memberNumber: "KT-2024-004", fullName: "Dewi Lestari", birthPlace: "Yogyakarta", birthDate: "1999-05-20", gender: "perempuan" as const, address: "Jl. Dahlia No. 3, Desa Sejahtera", phone: "084567890123", email: "dewi.lestari@email.com", education: "S1 Pendidikan", occupation: "Guru Swasta", skills: "Mengajar, Organisasi Event", joinDate: "2021-06-01", status: "aktif" as const },
    { id: randomUUID(), memberNumber: "KT-2024-005", fullName: "Rizky Pratama", birthPlace: "Semarang", birthDate: "2000-09-12", gender: "laki_laki" as const, address: "Jl. Kenanga No. 8, Desa Berkah", phone: "085678901234", email: "rizky.pratama@email.com", education: "SMK Teknik Informatika", occupation: "Mahasiswa / Freelancer", skills: "Desain Grafis, Video Editing", joinDate: "2023-01-15", status: "aktif" as const },
    { id: randomUUID(), memberNumber: "KT-2024-006", fullName: "Maya Sari", birthPlace: "Malang", birthDate: "2001-02-28", gender: "perempuan" as const, address: "Jl. Cempaka No. 15, Desa Harmoni", phone: "086789012345", email: "maya.sari@email.com", education: "S1 Kesehatan Masyarakat", occupation: "Tenaga Medis", skills: "Kesehatan, PMR", joinDate: "2023-06-20", status: "aktif" as const }
  ];

  await db.insert(members).values(memberData);
  console.log(`✅ ${memberData.length} anggota sampel dibuat`);

  // 3. Create Organization Structure
  const structureData = [
    { id: randomUUID(), name: "Ahmad Fauzi", position: "Ketua", level: 1, order: 1, description: "Pimpinan utama organisasi" },
    { id: randomUUID(), name: "Siti Nurhaliza", position: "Sekretaris", level: 2, order: 1, description: "Mengurus administrasi dan surat-menyurat" },
    { id: randomUUID(), name: "Budi Santoso", position: "Bendahara", level: 2, order: 2, description: "Mengelola keuangan organisasi" },
    { id: randomUUID(), name: "Dewi Lestari", position: "Koordinator Bidang Pendidikan", level: 3, order: 1 },
    { id: randomUUID(), name: "Bidang Kewirausahaan", position: "Koordinator Bidang Ekonomi", level: 3, order: 2 },
    { id: randomUUID(), name: "Bidang Seni & Budaya", position: "Koordinator Bidang Sosial", level: 3, order: 3 },
    { id: randomUUID(), name: "Bidang Olahraga", position: "Koordinator Bidang Olahraga", level: 3, order: 4 }
  ];

  for (const s of structureData) {
    await db.insert(organizationStructure).values(s);
  }

  console.log(`✅ ${structureData.length} posisi struktur dibuat`);

  // 4. Create Sample Activities
  await db.insert(activities).values({ id: randomUUID(), title: "Rapat Tahunan Periode 2024", description: "Evaluasi program tahun 2024 dan rencana kerja 2025", location: "Aula Desa Maju", startDate: new Date("2024-12-15").toISOString(), endDate: new Date("2024-12-16").toISOString(), responsiblePerson: "Ahmad Fauzi", budget: "2500000", status: "selesai" as const });
  
  await db.insert(activities).values({ id: randomUUID(), title: "Bakti Sosial Ramadhan 1446 H", description: "Pembagian takjil dan sembako untuk warga kurang mampu di bulan suci Ramadhan", location: "Masjid Jami' Desa Maju", startDate: new Date("2025-03-01").toISOString(), responsiblePerson: "Dewi Lestari", budget: "5000000", status: "rencana" as const });

  await db.insert(activities).values({ id: randomUUID(), title: "Pelatihan Digital Marketing untuk UMKM", description: "Pelatihan pemasaran digital bagi pelaku usaha mikro dan kecil desa", location: "Balai Pertemuan Desa", startDate: new Date("2025-02-15").toISOString(), responsiblePerson: "Rizky Pratama", budget: "3000000", status: "rencana" as const });

  await db.insert(activities).values({ id: randomUUID(), title: "Lomba 17 Agustus HUT RI ke-80", description: "Perlombaan dalam rangka memperingati Hari Kemerdekaan Republik Indonesia", location: "Lapangan Bola Desa Maju", startDate: "2025-08-17", responsiblePerson: "Ahmad Fauzi", budget: "10000000", status: "berlangsung" as const });

  console.log("✅ 4 kegiatan sampel dibuat");

  // 5. Create Sample Announcements
  await db.insert(announcements).values({
    id: randomUUID(),
    title: "Selamat Tahun Baru 2025!",
    content: "Selamat memasuki tahun baru 2025! Semoga Karang Taruna dapat terus berkarya dan berkontribusi untuk kemajuan desa dan bangsa.",
    type: "pengumuman",
    isPublished: true,
    publishedAt: new Date(),
    authorId: adminId
  });

  await db.insert(announcements).values({
    id: randomUUID(),
    title: "Penerimaan Anggota Baru Tahun 2025",
    content: "Karang Taruna membuka pendaftaran anggota baru periode Januari - Maret 2025. Persyaratan: usia minimal 17 tahun maksimal 35 tahun, domisili Desa Maju sekitarnya.",
    type: "pengumuman",
    isPublished: true,
    publishedAt: new Date(),
    authorId: adminId
  });

  await db.insert(announcements).values({
    id: randomUUID(),
    title: "Kejuaraan Turnamen Voli Antar Desa",
    content: "Tim voli Karang Taruna Desa Maju berhasil meraih Juara 2 dalam turnamen voli antar desa tingkat kecamatan.",
    type: "berita",
    isPublished: true,
    publishedAt: new Date(),
    authorId: adminId
  });

  console.log("✅ 3 pengumuman sampel dibuat");

  // 6. Create App Settings defaults
  const settingsDefaults = [
    { key: "org_name", value: "Karang Taruna Desa Muda Berkarya", description: "Nama organisasi lengkap" },
    { key: "widget_enabled", value: "true", description: "Aktifkan widget dukungan/traktiran" },
    { key: "support_recipient_name", value: "Perpus Opera", description: "Nama penerima donasi traktiran" },
    { key: "support_page_url", value: "https://trakteer.id/perpus_opera/", description: "URL halaman trakteer" }
  ];

  for (const setting of settingsDefaults) {
    await db.insert(appSettings).values({ ...setting, id: randomUUID() });
  }

  console.log(`✅ ${settingsDefaults.length} pengaturan default dibuat\n`);
  
  console.log("🎉 Seed data berhasil diselesaikan!");
  console.log("\n📋 Login credentials:");
  console.log("┌─────────────────────┬──────────────┬────────────┐");
  console.log("│ Email               │ Password     │ Role       │");
  console.log("├─────────────────────┼──────────────┼────────────┤");
  console.log("│ admin@karyuna.id    │ admin123     │ Super Admin│");
  console.log("│ ketua@karyuna.id    │ admin123     │ Ketua      │");
  console.log("│ sekretaris@karyuna │ admin123     │ Sekretaris │");
  console.log("│ bendahara@karyuna  │ admin123     │ Bendahara  │");
  console.log("│ koordinator@karyuna│ admin123     │ Koordinator│");
  console.log("│ anggota1@karyuna   │ admin123     │ Anggota    │");
  console.log("│ anggota2@karyuna   │ admin123     │ Anggota    │");
  console.log("└─────────────────────┴──────────────┴────────────┘");
}

seed()
  .catch((error) => { console.error("❌ Error saat seed data:", error); process.exit(1); })
  .finally(() => process.exit(0));
