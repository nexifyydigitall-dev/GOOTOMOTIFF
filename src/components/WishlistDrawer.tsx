import React from 'react';
import { Product } from '../types';
import { formatRupiah, openWhatsAppChat, createSingleProductWhatsAppMessage } from '../utils/whatsapp';
import { X, Heart, ShoppingBag, MessageCircle, Trash2, Wrench } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  wishlistIds: string[];
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant?: string) => void;
  storeName: string;
  storeWhatsAppNumber: string;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
  wishlistIds,
  onRemoveWishlist,
  onAddToCart,
  storeName,
  storeWhatsAppNumber,
}) => {
  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/70 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-zinc-200 animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-900 text-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            <h2 className="text-base font-bold text-white">Spare Part Favorit</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-600 text-white tabular-nums">
              {wishlistedProducts.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup daftar favorit"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-zinc-800">Belum Ada Spare Part Favorit</h3>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                Tandai ikon hati pada produk spare part atau oli yang Anda minati untuk menyimpannya di sini.
              </p>
            </div>
          ) : (
            wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200 items-center justify-between"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover bg-zinc-200 shrink-0"
                />

                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-[10px] font-bold text-red-600 uppercase">{product.brand}</div>
                  <h4 className="text-xs font-bold text-zinc-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs font-extrabold text-zinc-900 tabular-nums mt-0.5">
                    {formatRupiah(product.price)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onRemoveWishlist(product.id)}
                    className="text-zinc-400 hover:text-red-600 p-1"
                    title="Hapus dari favorit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onAddToCart(product, product.variants?.options[0])}
                      className="p-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-md"
                      title="Tambah ke keranjang"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const msg = createSingleProductWhatsAppMessage(
                          product,
                          storeName,
                          product.variants?.options[0],
                          1
                        );
                        openWhatsAppChat(storeWhatsAppNumber, msg);
                      }}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md"
                      title="Pesan via WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
