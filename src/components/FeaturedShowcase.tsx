import React from 'react';
import { Product } from '../types';
import { formatRupiah, createSingleProductWhatsAppMessage, openWhatsAppChat } from '../utils/whatsapp';
import { Sparkles, MessageCircle, ArrowRight, GraduationCap, PackageCheck } from 'lucide-react';

interface FeaturedShowcaseProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  storeName: string;
  storeWhatsAppNumber: string;
}

export const FeaturedShowcase: React.FC<FeaturedShowcaseProps> = ({
  products,
  onOpenDetail,
  storeName,
  storeWhatsAppNumber,
}) => {
  const featuredItems = products.filter((p) => p.featured).slice(0, 3);

  if (featuredItems.length === 0) return null;

  return (
    <section id="paket-bengkel" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Program & Paket Unggulan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
            Pilar Bisnis GO OTOMOTIF
          </h2>
        </div>
        <a
          href="#katalog"
          className="text-xs font-bold text-zinc-700 hover:text-red-600 flex items-center gap-1 transition"
        >
          <span>Lihat Semua Katalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredItems.map((item) => {
          const isTraining = item.itemType === 'training';
          return (
            <div
              key={item.id}
              onClick={() => onOpenDetail(item)}
              className="group relative bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 bg-zinc-950/85 backdrop-blur-xs text-white text-[11px] font-bold rounded flex items-center gap-1">
                    {isTraining ? <GraduationCap className="w-3 h-3 text-amber-400" /> : <PackageCheck className="w-3 h-3 text-red-400" />}
                    <span>{item.category}</span>
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wide">{item.brand}</span>
                  <h3 className="text-base font-bold text-zinc-900 group-hover:text-red-600 transition line-clamp-1 mt-0.5">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="mt-2 text-[11px] text-emerald-700 font-semibold">
                    {isTraining ? '✓ 80% Praktek Langsung + Sertifikat' : '✓ Manajemen Stok & Konsultasi Bisnis'}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-400 block">Biaya / Harga</span>
                  <span className="text-base font-black text-zinc-900 tabular-nums">
                    {formatRupiah(item.price)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const msg = createSingleProductWhatsAppMessage(
                      item,
                      storeName,
                      item.variants?.options[0],
                      1
                    );
                    openWhatsAppChat(storeWhatsAppNumber, msg);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isTraining ? 'Daftar WA' : 'Pesan WA'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
