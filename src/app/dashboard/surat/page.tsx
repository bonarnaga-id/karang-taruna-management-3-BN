"use client";

import { Mail, Send, Receipt, FileText, Clock } from "lucide-react";
import Link from "next/link";

export default function SuratPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Surat</h2>
          <p className="text-gray-500 mt-1">Kelola surat masuk dan keluar organisasi</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-12 text-center">
          <Mail className="w-20 h-20 mx-auto text-gray-300 mb-6" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Fitur Sedang Dikembangkan</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Modul pengelolaan surat masuk dan keluar sedang dalam pengembangan.
            Fitur ini akan tersedia dalam pembaruan mendatang.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Receipt className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">Surat Masuk</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Send className="w-8 h-8 mx-auto text-indigo-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">Surat Keluar</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <Clock className="w-8 h-8 mx-auto text-amber-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">Disposisi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
