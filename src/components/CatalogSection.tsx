import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, MotorcycleBrand } from '../types';
import { CATEGORIES_LIST, MOTORCYCLE_BRANDS_LIST } from '../data/products';
import { ProductCard } from './ProductCard';
import { formatRupiah } from '../utils/whatsapp';
import { 
  SlidersHorizontal, 
  LayoutGrid, 
  List, 
  RotateCcw, 
  Search, 
  X,
  ChevronDown,
  GraduationCap,
  PackageCheck,
  Scan
} from 'lucide-react';

interface CatalogSectionProps {
  products: Product[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, variant?: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  storeName: string;
  storeWhatsAppNumber: string;
  onOpenScanner?: () => void;
}

export type SortOption = 'rekomendasi' | 'harga-rendah' | 'harga-tinggi' | 'rating' | 'nama';
export type OfferingFilter = 'all' | 'training' | 'sparepart' | 'package';

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onOpenDetail,
  onAddToCart,
  wishlistIds,
  onToggleWishlist,
  storeName,
  storeWhatsAppNumber,
  onOpenScanner,
}) => {
  // Filters state
  const [offeringFilter, setOfferingFilter] = useState<OfferingFilter>('all');
  const [selectedBrand, setSelectedBrand] = useState<MotorcycleBrand>('Semua Merk');
  const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('rekomendasi');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [maxPriceLimit, setMaxPriceLimit] = useState<number>(6000000);

  const absoluteMaxPrice = useMemo(() => {
    return Math.max(...products.map(p => p.price), 6000000);
  }, [products]);

  const handleResetFilters = () => {
    onSearchChange('');
    onSelectCategory('Semua');
    setOfferingFilter('all');
    setSelectedBrand('Semua Merk');
    setMaxPriceLimit(absoluteMaxPrice);
    setSortBy('rekomendasi');
  };

  const isFiltered = 
    Boolean(searchQuery) || 
    selectedCategory !== 'Semua' || 
    offeringFilter !== 'all' ||
    selectedBrand !== 'Semua Merk' ||
    maxPriceLimit < absoluteMaxPrice || 
    sortBy !== 'rekomendasi';

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Offering type filter
        if (offeringFilter === 'training' && product.itemType !== 'training') return false;
        if (offeringFilter === 'sparepart' && product.itemType !== 'sparepart' && product.itemType !== 'tools') return false;
        if (offeringFilter === 'package' && product.itemType !== 'package') return false;

        // Category filter
        if (selectedCategory !== 'Semua' && product.category !== selectedCategory) {
          return false;
        }

        // Motorcycle brand compatibility filter
        if (selectedBrand !== 'Semua Merk') {
          const isCompatible = 
            product.compatibleBrands.includes(selectedBrand) || 
            product.compatibleBrands.includes('Universal / Semua Motor');
          if (!isCompatible) return false;
        }

        // Search filter: check name, desc, sku, partNumber, barcode, brand, models, tags
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchSku = product.sku.toLowerCase().includes(q);
          const matchPartNumber = (product.partNumber || product.specs?.partNumber || '').toLowerCase().includes(q);
          const matchBarcode = (product.barcode || '').toLowerCase().includes(q);
          const matchBrand = product.brand.toLowerCase().includes(q);
          const matchModels = product.compatibleModels.some(m => m.toLowerCase().includes(q));
          const matchTags = product.tags.some(t => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchSku && !matchPartNumber && !matchBarcode && !matchBrand && !matchModels && !matchTags) {
            return false;
          }
        }

        // Price limit filter
        if (product.price > maxPriceLimit) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'harga-rendah':
            return a.price - b.price;
          case 'harga-tinggi':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'nama':
            return a.name.localeCompare(b.name);
          case 'rekomendasi':
          default:
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return b.rating - a.rating;
        }
      });
  }, [products, offeringFilter, selectedCategory, selectedBrand, searchQuery, maxPriceLimit, sortBy]);

  return (
    <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1 flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4" />
            <span>Katalog Sparepart & Program Training Montir</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
            Daftar Produk & Kursus GO OTOMOTIF
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Menampilkan <span className="font-bold text-zinc-900 tabular-nums">{filteredProducts.length}</span> program & sparepart berkualitas.
          </p>
        </div>

        {/* View Switcher & Filter Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border transition ${
              showFiltersPanel || maxPriceLimit < absoluteMaxPrice
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Tambahan</span>
            {maxPriceLimit < absoluteMaxPrice && (
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            )}
          </button>

          {/* Grid / List switch */}
          <div className="flex items-center p-1 bg-zinc-200/80 rounded-lg">
            <button
              type="button"
              onClick={() => setLayoutView('grid')}
              aria-label="Tampilan Grid"
              className={`p-1.5 rounded-md transition ${layoutView === 'grid' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayoutView('list')}
              aria-label="Tampilan List"
              className={`p-1.5 rounded-md transition ${layoutView === 'list' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-500 hover:text-zinc-900'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Input & Scan Barcode Action Bar */}
      <div className="pt-5 pb-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <div className="relative flex-1 shadow-xs">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari sparepart, kode part (misal: 23100-K44-V01), nomor barcode, atau kelas training..."
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 placeholder:text-zinc-400 font-medium"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
              aria-label="Hapus pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {onOpenScanner && (
          <button
            type="button"
            onClick={onOpenScanner}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition whitespace-nowrap"
            title="Scan Barcode / QR Code Dus Sparepart"
          >
            <Scan className="w-4 h-4 text-white" />
            <span>Scan Barcode Sparepart</span>
          </button>
        )}
      </div>

      {/* Main Offering Segmented Tabs */}
      <div className="pt-2 pb-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOfferingFilter('all')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition ${
            offeringFilter === 'all'
              ? 'bg-red-600 text-white border-red-600 shadow-xs'
              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
          }`}
        >
          Semua Layanan
        </button>

        <button
          type="button"
          onClick={() => setOfferingFilter('training')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition ${
            offeringFilter === 'training'
              ? 'bg-red-600 text-white border-red-600 shadow-xs'
              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Training Montir Motor</span>
        </button>

        <button
          type="button"
          onClick={() => setOfferingFilter('package')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition ${
            offeringFilter === 'package'
              ? 'bg-red-600 text-white border-red-600 shadow-xs'
              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
          }`}
        >
          <PackageCheck className="w-3.5 h-3.5" />
          <span>Paket Buka Usaha Bengkel</span>
        </button>

        <button
          type="button"
          onClick={() => setOfferingFilter('sparepart')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border transition ${
            offeringFilter === 'sparepart'
              ? 'bg-red-600 text-white border-red-600 shadow-xs'
              : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'
          }`}
        >
          Sparepart & Tools
        </button>
      </div>

      {/* Motorcycle Brand Quick Filter */}
      <div className="pt-2 pb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mr-2">
          Kesesuaian Merk Motor:
        </span>
        <div className="inline-flex flex-wrap gap-1.5 mt-1 sm:mt-0">
          {MOTORCYCLE_BRANDS_LIST.map((brand) => {
            const isSelected = selectedBrand === brand;
            return (
              <button
                key={brand}
                type="button"
                onClick={() => setSelectedBrand(brand)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition ${
                  isSelected
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {brand}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Category Filter Tabs */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar border-b border-zinc-100">
        {CATEGORIES_LIST.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Expanded Filters Panel */}
      {showFiltersPanel && (
        <div className="my-4 p-4 sm:p-5 bg-zinc-100 rounded-xl border border-zinc-200 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in">
          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-700">Maksimal Harga / Biaya</label>
              <span className="text-xs font-extrabold text-red-600 tabular-nums">
                {formatRupiah(maxPriceLimit)}
              </span>
            </div>
            <input
              type="range"
              min={250000}
              max={absoluteMaxPrice}
              step={250000}
              value={maxPriceLimit}
              onChange={(e) => setMaxPriceLimit(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-zinc-500 mt-1 tabular-nums">
              <span>Rp 250 rb</span>
              <span>{formatRupiah(absoluteMaxPrice)}</span>
            </div>
          </div>

          {/* Sort By Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-700 block mb-2">Urutkan Berdasarkan</label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full appearance-none px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs text-zinc-800 font-semibold focus:outline-none focus:border-red-600 pr-8"
              >
                <option value="rekomendasi">Rekomendasi Utama (Paling Populer)</option>
                <option value="harga-rendah">Harga: Terendah ke Tertinggi</option>
                <option value="harga-tinggi">Harga: Tertinggi ke Terendah</option>
                <option value="rating">Rating Kepuasan Ulasan</option>
                <option value="nama">Nama Produk / Kelas (A - Z)</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Active filter badges */}
      {isFiltered && (
        <div className="flex flex-wrap items-center gap-2 py-3 text-xs text-zinc-600">
          <span className="text-zinc-400">Filter Aktif:</span>
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-200 text-zinc-800 font-medium">
              Pencarian: &quot;{searchQuery}&quot;
              <button 
                onClick={() => onSearchChange('')}
                className="hover:text-red-600 ml-1"
                aria-label="Hapus kata pencarian"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {offeringFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-200 text-zinc-800 font-medium">
              Tipe: {offeringFilter === 'training' ? 'Training Montir' : offeringFilter === 'package' ? 'Paket Buka Bengkel' : 'Sparepart'}
              <button 
                onClick={() => setOfferingFilter('all')}
                className="hover:text-red-600 ml-1"
                aria-label="Reset tipe penawaran"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory !== 'Semua' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-200 text-zinc-800 font-medium">
              Kategori: {selectedCategory}
              <button 
                onClick={() => onSelectCategory('Semua')}
                className="hover:text-red-600 ml-1"
                aria-label="Reset kategori"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedBrand !== 'Semua Merk' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-200 text-zinc-800 font-medium">
              Merk Motor: {selectedBrand}
              <button 
                onClick={() => setSelectedBrand('Semua Merk')}
                className="hover:text-red-600 ml-1"
                aria-label="Reset merk motor"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs font-bold text-red-600 hover:text-red-700 underline underline-offset-2 ml-2 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Semua</span>
          </button>
        </div>
      )}

      {/* Product Grid or List */}
      <div className="mt-4">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-zinc-200 p-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">
              Tidak Ada Sparepart atau Program yang Cocok
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
              Kami tidak menemukan data untuk kata kunci &quot;{searchQuery}&quot;. Anda dapat menanyakan langsung ketersediaan stok atau jadwal batch training berikutnya via WhatsApp.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Lihat Semua Katalog</span>
            </button>
          </div>
        ) : layoutView === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                layoutView="grid"
                onOpenDetail={onOpenDetail}
                onAddToCart={onAddToCart}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                storeName={storeName}
                storeWhatsAppNumber={storeWhatsAppNumber}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                layoutView="list"
                onOpenDetail={onOpenDetail}
                onAddToCart={onAddToCart}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                storeName={storeName}
                storeWhatsAppNumber={storeWhatsAppNumber}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
