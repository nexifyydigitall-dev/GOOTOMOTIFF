import React, { useRef } from 'react';
import logoGoOtomotif from '../assets/images/logo_go_otomotif.png';
import { ShoppingBag, MessageCircle, Heart, Scan } from 'lucide-react';
import { StoreSettings } from '../types';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onTriggerSecretAdmin?: () => void;
  onOpenScanner?: () => void;
  storeSettings: StoreSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onTriggerSecretAdmin,
  onOpenScanner,
  storeSettings,
}) => {
  const logoClicksRef = useRef<number[]>([]);

  const handleLogoClick = () => {
    // Discreet Easter egg: Clicking logo 3 times in 1.5 seconds triggers secret admin login
    const now = Date.now();
    logoClicksRef.current = [...logoClicksRef.current.filter((t: number) => now - t < 1500), now];
    if (logoClicksRef.current.length >= 3) {
      logoClicksRef.current = [];
      if (onTriggerSecretAdmin) {
        onTriggerSecretAdmin();
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950 text-zinc-100 border-b border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Official 3D GO OTOMOTIF Logo with Secret 3-Click Trigger */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none group py-1 shrink-0"
            title="GO OTOMOTIF (Klik 3x untuk Akses Rahasia)"
          >
            <img 
              src={logoGoOtomotif} 
              alt="GO Otomotif Logo" 
              className="h-10 sm:h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
            />
            <span className="text-[10px] text-zinc-400 font-medium tracking-tight hidden lg:inline border-l border-zinc-800 pl-3 leading-tight">
              Sparepart Management<br />& Training Montir
            </span>
          </div>

          {/* Zone 2: Public Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs lg:text-sm font-semibold text-zinc-300">
            <a href="#katalog" className="hover:text-red-400 transition-colors whitespace-nowrap shrink-0">
              Katalog Sparepart
            </a>
            <a href="#paket-bengkel" className="hover:text-red-400 transition-colors whitespace-nowrap shrink-0">
              Paket Buka Bengkel
            </a>
            <a href="#training-montir" className="hover:text-red-400 transition-colors whitespace-nowrap shrink-0">
              Training Montir Motor
            </a>
            <a href="#cara-pesan" className="hover:text-red-400 transition-colors whitespace-nowrap shrink-0">
              Alur Order & Daftar
            </a>
          </nav>

          {/* Zone 3: Actions (Clean Customer-Facing - No Visible Admin Buttons) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Scan Barcode Quick Trigger */}
            {onOpenScanner && (
              <button
                type="button"
                onClick={onOpenScanner}
                title="Scan Barcode / QR Spare Part"
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-red-500/80 rounded-lg transition shadow-xs"
              >
                <Scan className="w-3.5 h-3.5 text-red-500" />
                <span className="hidden sm:inline">Scan Part</span>
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              title="Daftar Favorit"
              aria-label="Daftar Favorit"
              className="relative p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart / Registration Drawer */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4 text-zinc-300" />
              <span className="hidden sm:inline">Pesanan / Daftar</span>
              <span className="w-5 h-5 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            </button>

            {/* Direct WhatsApp Contact CTA */}
            <a
              href={`https://wa.me/${storeSettings.whatsappNumber}?text=${encodeURIComponent('Halo GO OTOMOTIF, saya ingin konsultasi suplai sparepart / pendaftaran training montir motor.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi WA</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
