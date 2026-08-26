"use client";

import { useState } from "react";
import { Coffee, X, QrCode, ExternalLink } from "lucide-react";
import { appConfig } from "@/lib/config";

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);

  if (!appConfig.supportWidgetEnabled) {
    return null;
  }

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Buka widget dukungan"
      >
        <div className="relative flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Coffee className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-medium max-w-[200px] truncate hidden sm:block">
            {appConfig.supportLabel}
          </span>
          <span className="text-sm font-medium sm:hidden">Traktir ☕</span>
        </div>
        
        {/* Tooltip for mobile */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none sm:hidden">
          {appConfig.supportLabel}
        </div>
      </button>

      {/* Modal / Bottom Sheet */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Dukung pengembangan aplikasi"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Dukung Pengembangan</h3>
                <p className="text-sm text-gray-500">{appConfig.supportRecipientName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">
                Aplikasi ini dikembangkan secara sukarela dan GRATIS untuk digunakan. 
                Jika Anda merasa terbantu dan ingin mendukung pengembangannya, Anda bisa 
                memberikan traktiran kopi melalui platform di bawah ini.
              </p>

              {/* Amount Selection */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Pilih Nominal:</h4>
                <div className="grid grid-cols-3 gap-3">
                  {appConfig.supportAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountSelect(amount)}
                      className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                        selectedAmount === amount
                          ? 'bg-blue-600 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      Rp{Number(amount).toLocaleString("id-ID")}
                    </button>
                  ))}
                </div>

                {/* Custom amount option */}
                <button
                  type="button"
                  onClick={() => handleAmountSelect("custom")}
                  className={`mt-3 w-full py-3 px-4 rounded-xl text-sm font-medium transition-all border-2 border-dashed ${
                    selectedAmount === "custom"
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-200 text-gray-500 hover:border-blue-300'
                  }`}
                >
                  Nominal Lainnya
                </button>
              </div>

              {/* QR Code */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 text-center">
                <QrCode className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                <h4 className="font-semibold text-gray-800 mb-2">QR Code Pembayaran</h4>
                
                {/* QR Image Container */}
                <div className="inline-block bg-white p-4 rounded-xl shadow-sm mb-4">
                  {appConfig.supportQrImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={appConfig.supportQrImageUrl}
                      alt="QR Code Pembayaran untuk traktiran"
                      className="w-48 h-48 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                      <div className="text-center text-gray-400">
                        <QrCode className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-xs">QR Code belum tersedia</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedAmount && selectedAmount !== "custom" && (
                  <p className="text-lg font-bold text-blue-600 mb-2">
                    Nominal: Rp{Number(selectedAmount).toLocaleString("id-ID")}
                  </p>
                )}
                
                <a
                  href={appConfig.supportPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Buka Halaman Traktiran
                </a>
              </div>

              {/* Footer Note */}
              <p className="text-xs text-center text-gray-400 leading-relaxed">
                Terima kasih atas dukungan Anda! Semua dana yang diterima akan 
                digunakan untuk biaya server dan pengembangan aplikasi.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
