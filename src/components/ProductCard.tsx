import React, { useState } from 'react';
import { Product } from '../types';
import { formatRupiah, openWhatsAppChat, createSingleProductWhatsAppMessage } from '../utils/whatsapp';
import { MessageCircle, ShoppingBag, Heart, Star, Sparkles, Check, GraduationCap, PackageCheck, Scan, QrCode } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, variant?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  storeName: string;
  storeWhatsAppNumber: string;
  layoutView?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  storeName,
  storeWhatsAppNumber,
  layoutView = 'grid',
}) => {
  const [imageError, setImageError] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const isTraining = product.itemType === 'training';
  const displayPartNo = product.partNumber || product.specs?.partNumber || product.sku;
  const displayBarcode = product.barcode || displayPartNo;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants?.options[0];
    onAddToCart(product, defaultVariant);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1600);
  };

  const handleDirectWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVariant = product.variants?.options[0];
    const message = createSingleProductWhatsAppMessage(
      product, 
      storeName, 
      defaultVariant, 
      1
    );
    openWhatsAppChat(storeWhatsAppNumber, message);
  };

  if (layoutView === 'list') {
    return (
      <article
        onClick={() => onOpenDetail(product)}
        className="group relative flex flex-col sm:flex-row items-stretch bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
      >
        {/* Image Container */}
        <div className="relative w-full sm:w-60 shrink-0 bg-zinc-100 aspect-[4/3] sm:aspect-square overflow-hidden">
          {!imageError ? (
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 p-4 text-center">
              <span className="text-xs font-bold text-zinc-500 uppercase">{product.category}</span>
              <span className="text-sm font-bold text-zinc-800 mt-1 line-clamp-2">{product.name}</span>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
            {isTraining ? <GraduationCap className="w-3 h-3 text-amber-400" /> : <PackageCheck className="w-3 h-3 text-red-400" />}
            <span>{isTraining ? 'Training Montir' : 'Sparepart / Paket'}</span>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            aria-label="Simpan ke Favorit"
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-zinc-600 hover:text-red-600 transition shadow-xs"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
          </button>
        </div>

        {/* Info Column */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span className="font-extrabold text-zinc-800">{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className={product.stockStatus === 'ready' || product.stockStatus === 'open_batch' ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                {product.stockStatus === 'open_batch' ? 'Batch Terbuka' : 'Ready Stock'}
              </span>
            </div>

            {/* Part Number & Barcode Tag */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 font-mono text-[11px] font-bold">
                <span className="text-zinc-500 font-sans text-[10px]">KODE PART:</span>
                <span>{displayPartNo}</span>
              </div>
              {product.barcode && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-800 font-mono text-[11px]">
                  <Scan className="w-3 h-3 text-red-600" />
                  <span>{product.barcode}</span>
                </div>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-zinc-900 mt-2 group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>

            <p className="text-xs sm:text-sm text-zinc-600 mt-2 line-clamp-2 leading-relaxed">
              {product.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-zinc-600">
              <div className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="tabular-nums">{product.rating.toFixed(1)}</span>
                <span className="text-zinc-400 font-normal">({product.reviewsCount})</span>
              </div>
              {product.specs?.duration && (
                <>
                  <span aria-hidden="true" className="text-zinc-300">·</span>
                  <span className="font-semibold text-zinc-800">Durasi: {product.specs.duration}</span>
                </>
              )}
              {product.batchSchedule && (
                <>
                  <span aria-hidden="true" className="text-zinc-300">·</span>
                  <span className="text-emerald-700 font-medium">{product.batchSchedule}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 mt-4 border-t border-zinc-100">
            <div>
              <div className="text-lg sm:text-xl font-black text-zinc-900 tabular-nums">
                {formatRupiah(product.price)}
              </div>
              {product.originalPrice && (
                <div className="text-xs text-zinc-400 line-through tabular-nums">
                  {formatRupiah(product.originalPrice)}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickAdd}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition"
              >
                {addedToast ? <Check className="w-4 h-4 text-emerald-600" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{addedToast ? 'Tersimpan' : '+ Keranjang'}</span>
              </button>

              <button
                type="button"
                onClick={handleDirectWhatsApp}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{isTraining ? 'Daftar Kelas WA' : 'Pesan via WA'}</span>
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Grid view
  return (
    <article
      onClick={() => onOpenDetail(product)}
      className="group relative flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
    >
      {/* Visual Asset Container */}
      <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 p-4 text-center">
            <span className="text-xs font-bold text-zinc-500 uppercase">{product.category}</span>
            <span className="text-sm font-bold text-zinc-800 mt-1 line-clamp-2">{product.name}</span>
          </div>
        )}

        {/* Featured Tag */}
        {product.featured && (
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-zinc-950/90 backdrop-blur-xs text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-red-500" />
            <span>Unggulan</span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label="Simpan ke Favorit"
          className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 backdrop-blur-xs text-zinc-600 hover:text-red-600 transition shadow-xs"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-600 text-red-600' : ''}`} />
        </button>

        {/* Type / Batch Schedule Banner */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 px-2 py-1 rounded bg-zinc-950/85 backdrop-blur-xs text-zinc-200 text-[10px] font-semibold truncate flex items-center gap-1.5">
          {isTraining ? (
            <>
              <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{product.batchSchedule || 'Kelas Training Montir Motor'}</span>
            </>
          ) : (
            <>
              <PackageCheck className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>Kesesuaian: {product.compatibleBrands.slice(0, 2).join(', ')}</span>
            </>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="font-extrabold text-zinc-800">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.category}</span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-zinc-900 mt-1.5 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>

          {/* Prominent Kode Sparepart & Barcode */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 font-mono text-[10px] font-bold">
              <span className="text-zinc-400 font-sans font-semibold">PART:</span>
              <span className="truncate max-w-[130px]">{displayPartNo}</span>
            </div>

            {product.barcode && (
              <div 
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-700 font-mono text-[10px]"
                title={`Barcode: ${product.barcode}`}
              >
                <Scan className="w-2.5 h-2.5 text-red-600 shrink-0" />
                <span className="truncate max-w-[90px]">{product.barcode}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="font-bold text-zinc-800 tabular-nums">{product.rating.toFixed(1)}</span>
            <span className="text-zinc-400">({product.reviewsCount} ulasan)</span>
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-zinc-100 flex flex-col gap-2.5">
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-base sm:text-lg font-black text-zinc-900 tabular-nums">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-400 line-through tabular-nums">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
              {isTraining ? '✓ Termasuk Sertifikat & Modul' : '✓ Garansi Original & Barcode Aktif'}
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickAdd}
              className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition"
            >
              {addedToast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ShoppingBag className="w-3.5 h-3.5" />}
              <span className="truncate">{addedToast ? 'Masuk' : '+ Keranjang'}</span>
            </button>

            <button
              type="button"
              onClick={handleDirectWhatsApp}
              className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="truncate">{isTraining ? 'Daftar WA' : 'Pesan WA'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
