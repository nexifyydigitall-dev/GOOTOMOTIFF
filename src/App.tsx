/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Product, ProductCategory, CartItem, StoreSettings } from './types';
import { PRODUCTS_DATA, DEFAULT_STORE_SETTINGS } from './data/products';
import { CheckCircle2, X, Download } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedShowcase } from './components/FeaturedShowcase';
import { CatalogSection } from './components/CatalogSection';
import { OrderingGuideSection } from './components/OrderingGuideSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminManagerModal } from './components/AdminManagerModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { Footer } from './components/Footer';

const PRODUCTS_STORAGE_KEY = 'go_otomotif_products_v3';
const CART_STORAGE_KEY = 'go_otomotif_cart_v2';
const WISHLIST_STORAGE_KEY = 'go_otomotif_wishlist_v2';
const SETTINGS_STORAGE_KEY = 'go_otomotif_settings_v2';
const ADMIN_PIN_STORAGE_KEY = 'go_otomotif_admin_pin';

export default function App() {
  // Products state (persisted in localStorage, defaults to PRODUCTS_DATA)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : PRODUCTS_DATA;
    } catch {
      return PRODUCTS_DATA;
    }
  });

  // Admin Security & State
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || '8888';
    } catch {
      return '8888';
    }
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState(false);

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');

  // Selected Product for PDP modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerToast, setScannerToast] = useState<{ name: string; code: string } | null>(null);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state (IDs)
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Store Settings (GO OTOMOTIF default)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
    } catch {
      return DEFAULT_STORE_SETTINGS;
    }
  });

  // Secret Admin Trigger
  const handleTriggerSecretAdmin = useCallback(() => {
    if (isAdminAuthenticated) {
      setIsAdminManagerOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  }, [isAdminAuthenticated]);

  // Global Keyboard shortcut listener: Ctrl + Shift + A or Cmd + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleTriggerSecretAdmin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTriggerSecretAdmin]);

  // Check URL parameter (?admin) or hash (#admin)
  useEffect(() => {
    if (window.location.hash === '#admin' || window.location.search.includes('admin')) {
      handleTriggerSecretAdmin();
    }
  }, [handleTriggerSecretAdmin]);

  // Check URL parameter (?part=... or ?barcode=...) from QR/Barcode scans
  useEffect(() => {
    const checkUrlForPart = () => {
      const params = new URLSearchParams(window.location.search);
      const partQuery = params.get('part') || params.get('barcode') || (window.location.hash.startsWith('#part=') ? window.location.hash.replace('#part=', '') : null);
      if (partQuery) {
        const query = decodeURIComponent(partQuery).toLowerCase().trim();
        const match = products.find(p => {
          const pNum = (p.partNumber || p.specs?.partNumber || '').toLowerCase();
          const pBarcode = (p.barcode || '').toLowerCase();
          return pNum === query || pBarcode === query || p.sku.toLowerCase() === query;
        });
        if (match) {
          setSelectedProduct(match);
        }
      }
    };
    checkUrlForPart();
    window.addEventListener('popstate', checkUrlForPart);
    window.addEventListener('hashchange', checkUrlForPart);
    return () => {
      window.removeEventListener('popstate', checkUrlForPart);
      window.removeEventListener('hashchange', checkUrlForPart);
    };
  }, [products]);

  const handleBarcodeProductFound = (product: Product) => {
    setSelectedProduct(product);
    const code = product.partNumber || product.barcode || product.sku;
    setScannerToast({ name: product.name, code });
    setTimeout(() => setScannerToast(null), 4000);
  };

  // Persist Products
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Persist Wishlist
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistIds]);

  // Persist Store Settings
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(storeSettings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [storeSettings]);

  // Handle Admin PIN update
  const handleUpdateAdminPin = (newPin: string) => {
    setAdminPin(newPin);
    try {
      localStorage.setItem(ADMIN_PIN_STORAGE_KEY, newPin);
    } catch (e) {
      console.error('Failed to save PIN to localStorage', e);
    }
  };

  // Cart handlers
  const handleAddToCart = (
    product: Product, 
    variant?: string, 
    quantity: number = 1
  ) => {
    const itemId = `${product.id}-${variant || 'default'}`;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemId,
            product,
            selectedVariant: variant,
            quantity,
          },
        ];
      }
    });
  };

  const handleUpdateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(itemId);
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const handleRemoveCartItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      } else {
        return [...prev, product.id];
      }
    });
  };

  const handleScrollToCatalog = () => {
    const element = document.getElementById('katalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900 selection:bg-red-100 selection:text-red-900">
      {/* Top Navigation (Clean Public View) */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onTriggerSecretAdmin={handleTriggerSecretAdmin}
        onOpenScanner={() => setIsScannerOpen(true)}
        storeSettings={storeSettings}
      />

      <main className="flex-1">
        {/* Storefront Hero */}
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onScrollToCatalog={handleScrollToCatalog}
          onOpenScanner={() => setIsScannerOpen(true)}
        />

        {/* Featured Showcase */}
        <FeaturedShowcase
          products={products}
          onOpenDetail={setSelectedProduct}
          storeName={storeSettings.storeName}
          storeWhatsAppNumber={storeSettings.whatsappNumber}
        />

        {/* Catalog with Search, Category Filtering, and Barcode Scan Button */}
        <CatalogSection
          products={products}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onOpenDetail={setSelectedProduct}
          onAddToCart={handleAddToCart}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          storeName={storeSettings.storeName}
          storeWhatsAppNumber={storeSettings.whatsappNumber}
          onOpenScanner={() => setIsScannerOpen(true)}
        />

        {/* 4-Step Workshop Ordering & Booking Guide */}
        <OrderingGuideSection />
      </main>

      {/* Footer with Discreet Admin Keyhole Lock */}
      <Footer
        storeSettings={storeSettings}
        onTriggerSecretAdmin={handleTriggerSecretAdmin}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        storeName={storeSettings.storeName}
        storeWhatsAppNumber={storeSettings.whatsappNumber}
      />

      {/* Cart & Service Booking Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        storeSettings={storeSettings}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={products}
        wishlistIds={wishlistIds}
        onRemoveWishlist={(id) => setWishlistIds((prev) => prev.filter((item) => item !== id))}
        onAddToCart={handleAddToCart}
        storeName={storeSettings.storeName}
        storeWhatsAppNumber={storeSettings.whatsappNumber}
      />

      {/* Secret Admin Login Modal (Triggered by Secret Shortcut / Keyhole) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        currentPin={adminPin}
        onSuccess={() => {
          setIsAdminAuthenticated(true);
          setIsAdminLoginOpen(false);
          setIsAdminManagerOpen(true);
        }}
      />

      {/* Full Admin Catalog & Program Manager Modal */}
      <AdminManagerModal
        isOpen={isAdminManagerOpen}
        onClose={() => setIsAdminManagerOpen(false)}
        products={products}
        onSaveProducts={setProducts}
        onLogout={() => {
          setIsAdminAuthenticated(false);
          setIsAdminManagerOpen(false);
        }}
        currentPin={adminPin}
        onUpdatePin={handleUpdateAdminPin}
        storeSettings={storeSettings}
        onSaveStoreSettings={setStoreSettings}
      />

      {/* Discreet Floating Admin Dock (Only visible when Admin is currently logged in) */}
      {isAdminAuthenticated && (
        <aside 
          aria-label="Panel Admin Aktif" 
          className="fixed bottom-4 right-4 z-40 bg-zinc-900/95 text-white border border-red-500/50 shadow-2xl rounded-full px-3.5 py-2 flex items-center gap-2.5 text-xs backdrop-blur-md animate-fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-zinc-200">Mode Admin Aktif</span>
          <button
            type="button"
            onClick={() => setIsAdminManagerOpen(true)}
            className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full transition shadow-xs"
          >
            Buka Panel
          </button>
          <a
            href="/download/index.html"
            download="index.html"
            title="Download Single-File index.html Siap Pakai"
            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-200 hover:text-white font-bold rounded-full transition shadow-xs border border-zinc-700 flex items-center gap-1"
          >
            <Download className="w-3 h-3 text-red-400" />
            <span>Unduh index.html</span>
          </a>
          <button
            type="button"
            onClick={() => setIsAdminAuthenticated(false)}
            className="text-zinc-400 hover:text-white text-[11px] underline ml-1"
          >
            Kunci
          </button>
        </aside>
      )}

      {/* Live Camera & Hardware Barcode/QR Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        products={products}
        onProductFound={handleBarcodeProductFound}
      />

      {/* Scanned Barcode Success Floating Toast */}
      {scannerToast && (
        <aside 
          aria-label="Notifikasi Barcode Ditemukan"
          className="fixed top-20 right-4 z-50 bg-zinc-950 text-white border border-emerald-500/80 rounded-2xl p-4 shadow-2xl max-w-sm flex items-start gap-3 animate-fade-in"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
              <span>Barcode Terdeteksi</span>
              <span>·</span>
              <span className="font-mono text-white bg-zinc-800 px-1.5 py-0.2 rounded border border-zinc-700">
                {scannerToast.code}
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate mt-1">
              {scannerToast.name}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5">
              Detail barang langsung ditampilkan.
            </p>
          </div>
          <button 
            type="button" 
            onClick={() => setScannerToast(null)} 
            className="text-zinc-500 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}
    </div>
  );
}
