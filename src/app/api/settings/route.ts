import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth, isAdmin } from "@/lib/auth-middleware";

// GET settings (publik - untuk konfigurasi frontend)
export async function GET() {
  try {
    const data = await db.select().from(appSettings);
    
    // Convert to key-value object
    const settingsMap: Record<string, string> = {};
    data.forEach(setting => {
      settingsMap[setting.key] = setting.value;
    });

    return NextResponse.json({ data: settingsMap });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// UPDATE setting (hanya admin)
export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth.error) return auth.error;
    
    if (!auth.user || !isAdmin(auth.user.role)) {
      return NextResponse.json({ error: "Hanya administrator yang dapat mengubah pengaturan" }, { status: 403 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Key dan value wajib diisi" }, { status: 400 });
    }

    // Cek apakah setting ada
    const [existingSetting] = await db.select().from(appSettings).where(eq(appSettings.key, key));

    if (existingSetting) {
      await db.update(appSettings).set({ 
        value: String(value),
        updatedAt: new Date()
      }).where(eq(appSettings.key, key));
    } else {
      await db.insert(appSettings).values({
        id: crypto.randomUUID(),
        key,
        value: String(value)
      });
    }

    return NextResponse.json({ message: "Pengaturan berhasil disimpan" });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
