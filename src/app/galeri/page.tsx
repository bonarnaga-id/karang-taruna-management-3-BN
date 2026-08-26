"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Grid3X3 } from "lucide-react";

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string | null;
  createdAt: string;
}

export default function GaleriPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setGalleryItems(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Sample gallery data for demo when API returns empty
  const sampleImages = [
    { title: "Rapat Tahunan 2024", color: "from-blue-400 to-cyan-500" },
    { title: "Bakti Sosial Ramadhan", color: "from-emerald-400 to-teal-500" },
    { title: "Pelatihan Kewirausahaan", color: "from-purple-400 to-pink-500" },
    { title: "Lomba 17 Agustus", color: "from-red-400 to-orange-500" },
    { title: "Gotong Royong Bersih Desa", color: "from-green-400 to-lime-500" },
    { title: "Peringatan Hari Sumpah Pemuda", color: "from-indigo-400 to-violet-500" }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-500 to-rose-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Grid3X3 className="w-16 h-16 mx-auto mb-4 text-pink-200" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Galeri Foto</h1>
          <p className="text-lg text-pink-100 max-w-2xl mx-auto">
            Dokumentasi kegiatan dan momen berharga Karang Taruna
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 md:py-20 bg-white min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-2xl" />
              ))}
            </div>
          ) : galleryItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedImage(item)}
                  className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to gradient placeholder if image fails to load
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement!.classList.add(
                        sampleColors[Math.floor(Math.random() * sampleColors.length)]
                      );
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                    <div className="p-4 text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 w-full">
                      <p className="font-semibold text-sm line-clamp-2">{item.title}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Fallback with demo images */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sampleImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`group aspect-square overflow-hidden rounded-2xl bg-gradient-to-br ${img.color} flex items-center justify-center cursor-default`}
                >
                  <div className="text-center text-white p-4">
                    <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-80" />
                    <p className="font-medium text-sm">{img.title}</p>
                  </div>
                </button>
              ))}
              
              {/* Empty state notice */}
              <div className="col-span-full mt-8 text-center">
                <p className="text-gray-500 text-sm">
                  Galeri akan menampilkan foto asli setelah data dimasukkan melalui dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-label="Foto galeri"
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
            aria-label="Tutup"
          >
            ✕
          </button>
          <div 
            className="max-w-4xl max-h-[90vh] content-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="text-white font-semibold text-lg">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300 mt-1 text-sm">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const sampleColors = [
  "bg-gradient-to-br from-blue-400 to-cyan-500",
  "bg-gradient-to-br from-emerald-400 to-teal-500",
  "bg-gradient-to-br from-purple-400 to-pink-500",
  "bg-gradient-to-br from-red-400 to-orange-500"
];
