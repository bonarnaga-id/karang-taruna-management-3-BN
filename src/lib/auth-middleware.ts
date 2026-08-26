import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
  name: string;
}

// Cek autentikasi dan return user info
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthUser | null> {
  const session = await getSession();
  
  if (!session) {
    return null;
  }
  
  return {
    userId: session.userId,
    email: session.email,
    role: session.role,
    name: session.name
  };
}

// Middleware untuk route yang membutuhkan login
export async function requireAuth(request: NextRequest): Promise<{ user: AuthUser; error?: never } | { user?: never; error: NextResponse }> {
  const user = await getAuthenticatedUser(request);
  
  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Autentikasi diperlukan. Silakan login terlebih dahulu." },
        { status: 401 }
      )
    };
  }
  
  return { user };
}

// Cek permission berdasarkan role
import { appConfig } from "@/lib/config";

export function hasPermission(userRole: string, requiredPermission: string): boolean {
  const rolePermissions = appConfig.permissions[userRole as keyof typeof appConfig.permissions];
  return rolePermissions?.includes(requiredPermission) || false;
}

// Roles yang bisa menyetujui transaksi keuangan
const APPROVAL_ROLES = ["super_admin", "ketua", "bendahara"];

export function canApproveFinance(role: string): boolean {
  return APPROVAL_ROLES.includes(role);
}

// Role hierarchy untuk akses admin
const ADMIN_ROLES = ["super_admin", "admin"];

export function isAdmin(role: string): boolean {
  return ADMIN_ROLES.includes(role);
}
