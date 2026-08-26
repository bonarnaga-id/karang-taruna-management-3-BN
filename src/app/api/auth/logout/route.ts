import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/auth";
import { getSession } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function POST() {
  try {
    const session = await getSession();
    
    if (session) {
      await createAuditLog(session.userId, "LOGOUT", "users", session.userId);
    }
    
    await removeAuthCookie();
    
    return NextResponse.json({ message: "Logout berhasil" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
