"use client";

import { useState, useEffect } from "react";
import { Settings, Save, User, Shield, Bell, Palette, Database } from "lucide-react";
import { appConfig } from "@/lib/config";

export default function PengaturanPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => setSettings(d.data || {}));
  }, []);

  const handleSave = async () => {
    await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Pengaturan Aplikasi</h2>
        <p className="text-gray-500 mt-1">Konfigurasi sistem Karyuna</p>
      </div>

      {/* Organization Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Informasi Organisasi</h3>
        </div>
        
        <div className="p-6 space-y-4">
          {[
            { key: "org_name", label: "Nama Organisasi", defaultValue: appConfig.organizationName },
            { key: "org_short_name", label: "Nama Singkat", defaultValue: appConfig.organizationShortName },
            { key: "org_address", label: "Alamat", defaultValue: appConfig.address },
            { key: "org_email", label: "Email Organisasi", defaultValue: appConfig.email },
            { key: "org_phone", label: "Telepon", defaultValue: appConfig.phone }
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
              <input
                type={field.key.includes("email") ? "email" : "text"}
                value={settings[field.key] || field.defaultValue}
                onChange={(e) => setSettings({...settings, [field.key]: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* App Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <Palette className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Tampilan & Widget</h3>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">QR Code Traktiran (URL Gambar)</label>
            <input
              type="text"
              value={settings.support_qr_url || appConfig.supportQrImageUrl}
              onChange={(e) => setSettings({...settings, support_qr_url: e.target.value})}
              placeholder="/assets/qr-traktiran.png"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Penerima Dukungan</label>
            <input
              type="text"
              value={settings.support_recipient_name || appConfig.supportRecipientName}
              onChange={(e) => setSettings({...settings, support_recipient_name: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Halaman Traktiran</label>
            <input
              type="url"
              value={settings.support_page_url || appConfig.supportPageUrl}
              onChange={(e) => setSettings({...settings, support_page_url: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-medium text-gray-900">Tampilkan Widget Dukungan</p>
              <p className="text-sm text-gray-500">Widget traktiran di pojok kanan bawah</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox"
                checked={settings.widget_enabled !== "false"}
                onChange={(e) => setSettings({...settings, widget_enabled: String(e.target.checked)})}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Save className="w-5 h-5" />
          Simpan Pengaturan
        </button>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-slide-in-right flex items-center gap-2">
          ✓ Pengaturan berhasil disimpan!
        </div>
      )}

      {/* Config Reference */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <Shield className="w-8 h-8 text-yellow-600 mb-3" />
        <h3 className="font-semibold text-gray-900 mb-2">Variabel Konfigurasi Environment</h3>
        <pre className="text-sm text-gray-600 overflow-x-auto bg-white/60 rounded-lg p-4 font-mono">{`# Aplikasi
APP_NAME=Karyuna
APP_DOMAIN=http://localhost:3000

# Organisasi  
ORG_NAME=Karang Taruna Desa Muda Berkarya
ORG_ADDRESS=Jl. Pemuda No. 123
ORG_EMAIL=karangtaruna@desamaju.id
ORG_PHONE=+6281234567890

# Support Widget
VITE_SUPPORT_WIDGET_ENABLED=true
VITE_SUPPORT_RECIPIENT_NAME="Perpus Opera"
VITE_SUPPORT_QR_IMAGE_URL=/assets/qr-traktiran.png
VITE_SUPPORT_PAGE_URL=https://trakteer.id/perpus_opera/

# Database
DATABASE_URL=postgresql://...
JWT_SECRET=rubah-ini-di-production`}</pre>
      </div>
    </div>
  );
}
