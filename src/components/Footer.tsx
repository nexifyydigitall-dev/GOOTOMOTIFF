import React from 'react';
import logoGoOtomotif from '../assets/images/logo_go_otomotif.png';
import { StoreSettings } from '../types';
import { MessageCircle, MapPin, Clock, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  storeSettings: StoreSettings;
  onTriggerSecretAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  storeSettings,
  onTriggerSecretAdmin,
}) => {
  return (
    <footer id="training-montir" className="bg-zinc-950 text-zinc-300 pt-14 pb-10 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-zinc-800">
          
          {/* Brand Info with Official 3D Logo */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center">
              <img 
                src={logoGoOtomotif} 
                alt="GO Otomotif" 
                className="h-12 w-auto object-contain drop-shadow-md"
              />
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              {storeSettings.tagline}. Solusi lengkap terintegrasi: Suplai suku cadang motor harga distributor tangan pertama, paket modal buka bengkel mandiri, serta kursus mekanik motor injeksi & CVT modern.
            </p>

            <div className="space-y-2 text-xs text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{storeSettings.addressDetail || storeSettings.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
                <span>{storeSettings.operatingHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Links (Customer Only - Clean) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Layanan Utama
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#katalog" className="text-zinc-400 hover:text-white transition">
                  Katalog Suku Cadang Fast-Moving
                </a>
              </li>
              <li>
                <a href="#paket-bengkel" className="text-zinc-400 hover:text-white transition">
                  Paket Modal Buka Usaha Bengkel
                </a>
              </li>
              <li>
                <a href="#training-montir" className="text-zinc-400 hover:text-white transition">
                  Kursus Mekanik Injeksi & Scanner
                </a>
              </li>
              <li>
                <a href="#cara-pesan" className="text-zinc-400 hover:text-white transition">
                  Panduan Pemesanan via WhatsApp
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${storeSettings.whatsappNumber}?text=${encodeURIComponent('Halo GO OTOMOTIF, saya ingin konsultasi kemitraan suplai sparepart.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition"
                >
                  Kerjasama Distributor & Suplai
                </a>
              </li>
            </ul>
          </div>

          {/* WhatsApp Direct Hotline */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Konsultasi Suplai & Pendaftaran
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Ingin konsultasi modal buka bengkel motor atau tanya jadwal batch training terdekat? Hubungi kami langsung.
            </p>
            <a
              href={`https://wa.me/${storeSettings.whatsappNumber}?text=${encodeURIComponent('Halo ' + storeSettings.storeName + ', saya ingin konsultasi suplai sparepart motor / pendaftaran training montir.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp +{storeSettings.whatsappNumber}</span>
            </a>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sertifikat Resmi & Jaminan Kualitas Sparepart Asli</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Discreet Hidden Admin Keyhole */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <p 
              onDoubleClick={onTriggerSecretAdmin}
              className="select-none cursor-default"
              title="GO OTOMOTIF Workshop & Training Academy"
            >
              © {new Date().getFullYear()} {storeSettings.storeName}. Hak cipta dilindungi undang-undang.
            </p>
            {/* Subtle invisible keyhole lock for admin */}
            <button
              type="button"
              onClick={onTriggerSecretAdmin}
              className="text-zinc-800 hover:text-zinc-500 transition p-1 focus:outline-none"
              title="Portal Keamanan"
              aria-label="Security Access"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            <span>Metode: Transfer Bank BCA/Mandiri, QRIS, DP Training 50%, Cash Workshop</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
