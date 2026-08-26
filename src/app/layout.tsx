import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SupportWidget } from "@/components/widgets/SupportWidget";

export const metadata: Metadata = {
  title: "Karyuna - Sistem Manajemen Karang Taruna",
  description: "Aplikasi manajemen organisasi Karang Taruna modern dan terintegrasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <SupportWidget />
        </div>
      </body>
    </html>
  );
}
