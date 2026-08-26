"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Eye, EyeOff, Shield, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login gagal. Silakan coba lagi.");
        return;
      }

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Masuk ke Dashboard</h1>
          <p className="text-blue-300">
            Masuk untuk mengelola organisasi Karang Taruna
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          {error && (
            <div className="flex items-start gap-3 bg-red-500/20 border border-red-400/30 rounded-xl p-4 mb-6 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-1.5">
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@karangtaruna.id"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-400" />
                <span className="text-gray-300">Ingat saya</span>
              </label>
              <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
                Lupa password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-70 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Masuk
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              Belum punya akun?{" "}
              <span className="text-blue-400">Hubungi administrator untuk mendapatkan akses.</span>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Koneksi aman & terenkripsi</span>
        </div>

        {/* Back to home */}
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
