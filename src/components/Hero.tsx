import React from 'react';
import logoGoOtomotif from '../assets/images/logo_go_otomotif.png';
import { Search, GraduationCap, PackageCheck, MessageCircle, ArrowRight, CheckCircle2, Scan } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onScrollToCatalog: () => void;
  onOpenScanner?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onScrollToCatalog,
  onOpenScanner,
}) => {
  return (
    <section className="relative overflow-hidden bg-zinc-950 text-white border-b border-zinc-800">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <img 
                src={logoGoOtomotif} 
                alt="GO Otomotif" 
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-lg"
              />
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-xs font-bold uppercase tracking-wider text-red-400 w-fit">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span>Distribusi Sparepart & Akademi Montir Motor</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Manajemen Sparepart Motor & Training Montir <span className="text-red-500">GO OTOMOTIF</span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
              Pusat suplai suku cadang motor fast-moving grosir & retail, paket modal buka usaha bengkel mandiri, serta kursus pelatihan mekanik motor injeksi & CVT profesional bersertifikat.
            </p>

            {/* Interactive Hero Search Input */}
            <div className="max-w-xl">
              <div className="relative flex items-center shadow-lg">
                <Search className="absolute left-4 w-5 h-5 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onScrollToCatalog();
                    }
                  }}
                  placeholder="Cari sparepart matic, training injeksi, paket buka bengkel, scanner..."
                  className="w-full pl-12 pr-36 sm:pr-48 py-3.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition placeholder:text-zinc-500"
                />
                <div className="absolute right-2 flex items-center gap-1.5">
                  {onOpenScanner && (
                    <button
                      type="button"
                      onClick={onOpenScanner}
                      className="px-2.5 sm:px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold rounded-lg border border-zinc-700 transition flex items-center gap-1.5 shadow-sm"
                      title="Scan Barcode / QR Spare Part"
                    >
                      <Scan className="w-3.5 h-3.5 text-red-500" />
                      <span className="hidden sm:inline">Scan</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onScrollToCatalog}
                    className="px-3.5 sm:px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Cari</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick automotive suggestions */}
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-zinc-400">
                <span className="font-semibold text-zinc-500">Paling dicari:</span>
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('Paket Buka Bengkel');
                    onScrollToCatalog();
                  }}
                  className="hover:text-red-400 underline underline-offset-2"
                >
                  Paket Buka Bengkel
                </button>
                <span aria-hidden="true" className="text-zinc-700">·</span>
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('Training Injeksi');
                    onScrollToCatalog();
                  }}
                  className="hover:text-red-400 underline underline-offset-2"
                >
                  Training Injeksi
                </button>
                <span aria-hidden="true" className="text-zinc-700">·</span>
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('CVT');
                    onScrollToCatalog();
                  }}
                  className="hover:text-red-400 underline underline-offset-2"
                >
                  Set CVT Matic
                </button>
                <span aria-hidden="true" className="text-zinc-700">·</span>
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('Scanner');
                    onScrollToCatalog();
                  }}
                  className="hover:text-red-400 underline underline-offset-2"
                >
                  Scanner Motor OBD2
                </button>
              </div>
            </div>

            {/* Business Trust points */}
            <div className="pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-zinc-800 text-red-500">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <span>Suplai Sparepart Grosir & Retail</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-zinc-800 text-amber-500">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span>Pelatihan 80% Praktek Langsung</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-md bg-zinc-800 text-emerald-500">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>Konsultasi Buka Usaha via WA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Photography */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 aspect-[16/10] sm:aspect-[4/3] lg:aspect-[4/3] bg-zinc-900 group">
              <img
                src="/src/assets/images/hero_motorcycle_training_parts_1792342706050.jpg"
                alt="Akademi Pelatihan Montir Motor dan Gudang Sparepart GO OTOMOTIF"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
              <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-xs px-2.5 py-1.5 rounded-xl border border-zinc-700/60 shadow-lg flex items-center gap-1.5">
                <img src={logoGoOtomotif} alt="GO Otomotif Badge" className="h-5 w-auto object-contain" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent flex flex-col justify-end p-6">
                <span className="text-xs uppercase tracking-wider text-red-400 font-bold">Vocational Training & Warehouse</span>
                <p className="text-lg font-bold text-white tracking-tight">Akademi Montir & Pusat Stok Sparepart</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Siap Cetak Mekanik Andal & Wirausaha Bengkel Mandiri</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
