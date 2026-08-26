import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  uuid,
  jsonb,
  decimal
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Enums
export const roleEnum = pgEnum("role", [
  "super_admin",
  "admin",
  "ketua",
  "sekretaris",
  "bendahara",
  "koordinator",
  "anggota"
]);

export const genderEnum = pgEnum("gender", ["laki_laki", "perempuan"]);

export const membershipStatusEnum = pgEnum("membership_status", [
  "aktif",
  "tidak_aktif",
  "pending",
  "dikeluarkan"
]);

export const activityStatusEnum = pgEnum("activity_status", [
  "rencana",
  "berlangsung",
  "selesai",
  "dibatalkan"
]);

export const transactionTypeEnum = pgEnum("transaction_type", ["pemasukan", "pengeluaran"]);

export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "disetujui",
  "ditolak"
]);

export const documentTypeEnum = pgEnum("document_type", [
  "proposal",
  "laporan",
  "surat_masuk",
  "surat_keluar",
  "dokumen_lain"
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "success",
  "warning",
  "error"
]);

// Users Table (untuk login dashboard)
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: roleEnum("role").default("anggota").notNull(),
  memberId: uuid("member_id"),
  avatar: text("avatar"),
  isActive: boolean("is_active").default(true).notNull(),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Members Table (Data Anggota)
export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  memberNumber: text("member_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  birthPlace: text("birth_place"),
  birthDate: text("birth_date"),
  gender: genderEnum("gender"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  education: text("education"),
  occupation: text("occupation"),
  skills: text("skills"),
  joinDate: text("join_date"),
  status: membershipStatusEnum("status").default("pending").notNull(),
  photo: text("photo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Organization Structure
export const organizationStructure = pgTable("organization_structure", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  parentId: uuid("parent_id"),
  level: integer("level").default(1).notNull(),
  memberId: uuid("member_id"),
  description: text("description"),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Activities / Kegiatan
export const activities = pgTable("activities", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  responsiblePerson: text("responsible_person"),
  committee: jsonb("committee"), // Array of member IDs
  budget: text("budget"),
  participants: jsonb("participants"), // Array of participant data
  status: activityStatusEnum("status").default("rencana").notNull(),
  imageUrl: text("image_url"),
  reportUrl: text("report_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Attendance / Presensi
export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  activityId: uuid("activity_id").references(() => activities.id, { onDelete: "cascade" }).notNull(),
  memberId: uuid("member_id").references(() => members.id, { onDelete: "cascade" }).notNull(),
  status: text("status").notNull(), // hadir, tidak_hadir, izin, sakit
  checkInTime: timestamp("check_in_time"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Financial Transactions / Keuangan
export const financialTransactions = pgTable("financial_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: text("date").notNull(),
  type: transactionTypeEnum("type").notNull(),
  category: text("category").notNull(),
  amount: text("amount").notNull(),
  source: text("source"),
  description: text("description"),
  proofUrl: text("proof_url"),
  status: transactionStatusEnum("status").default("pending").notNull(),
  approvedBy: uuid("approved_by"),
  changeHistory: jsonb("change_history"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Documents
export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  type: documentTypeEnum("type").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: text("file_size"),
  fileType: text("file_type"),
  description: text("description"),
  activityId: uuid("activity_id").references(() => activities.id),
  uploadedBy: uuid("uploaded_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// News / Announcements / Pengumuman
export const announcements = pgTable("announcements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").default("pengumuman"), // pengumuman, berita
  imageUrl: text("image_url"),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Gallery
export const gallery = pgTable("gallery", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  activityId: uuid("activity_id").references(() => activities.id),
  uploadedBy: uuid("uploaded_by").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Notifications
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").default("info").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Audit Log
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: text("entity_id"),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("timestamp").defaultNow().notNull()
});

// App Settings
export const appSettings = pgTable("app_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Relations
export const usersRelations = relations(users, ({ one }) => ({
  member: one(members, {
    fields: [users.memberId],
    references: [members.id]
  })
}));

export const membersRelations = relations(members, ({ many }) => ({
  attendance: many(attendance),
  users: many(users)
}));

export const activitiesRelations = relations(activities, ({ many }) => ({
  attendance: many(attendance),
  gallery: many(gallery),
  documents: many(documents)
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  activity: one(activities, {
    fields: [attendance.activityId],
    references: [activities.id]
  }),
  member: one(members, {
    fields: [attendance.memberId],
    references: [members.id]
  })
}));
