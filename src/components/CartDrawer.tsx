import React, { useState } from 'react';
import { CartItem, CustomerOrderInfo, StoreSettings } from '../types';
import { formatRupiah, createCartOrderWhatsAppMessage, openWhatsAppChat } from '../utils/whatsapp';
import { X, Trash2, ShoppingBag, Copy, Check, MessageCircle, AlertCircle, GraduationCap, PackageCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  storeSettings: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  storeSettings,
}) => {
  if (!isOpen) return null;

  const hasTraining = items.some(i => i.product.itemType === 'training');
  const hasSparepart = items.some(i => i.product.itemType !== 'training');

  const [customer, setCustomer] = useState<CustomerOrderInfo>({
    name: '',
    phone: '',
    orderType: hasTraining ? 'training_registration' : 'sparepart_order',
    storeOrWorkshopName: '',
    participantPurpose: 'Ingin Buka Usaha Bengkel Mandiri',
    preferredBatchSchedule: 'Batch Terdekat (Bulan Ini)',
    address: '',
    city: '',
    notes: '',
    paymentMethod: hasTraining ? 'DP Training 50%' : 'Transfer BCA',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [formError, setFormError] = useState('');

  const totalBiaya = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const previewMessage = createCartOrderWhatsAppMessage(items, customer, storeSettings.storeName);

  const handleSendOrder = () => {
    if (items.length === 0) return;
    if (!customer.name.trim()) {
      setFormError('Mohon isi nama lengkap Anda.');
      return;
    }
    if (!customer.phone.trim()) {
      setFormError('Mohon isi nomor WhatsApp aktif Anda.');
      return;
    }
    if (!customer.city.trim()) {
      setFormError('Mohon isi kota domisili atau tujuan pengiriman.');
      return;
    }

    setFormError('');
    openWhatsAppChat(storeSettings.whatsappNumber, previewMessage);
  };

  const handleCopyMessage = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(previewMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-zinc-950/70 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl border-l border-zinc-200 animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Keranjang Order & Pendaftaran</h2>
              <span className="text-[11px] text-zinc-400">GO OTOMOTIF Supply & Academy</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-zinc-400 hover:text-red-400 px-2 py-1 transition"
              >
                Kosongkan
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup keranjang"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-zinc-800">Keranjang Masih Kosong</h3>
              <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                Pilih paket sparepart motor, tools scanner, atau daftar kelas training montir motor lalu klik &quot;+ Keranjang&quot;.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-zinc-800 transition"
              >
                Jelajahi Katalog
              </button>
            </div>
          ) : (
            <>
              {/* Product list */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Daftar Pesanan & Program Terpilih
                </h3>
                {items.map((item) => {
                  const isItemTraining = item.product.itemType === 'training';
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-200/90 items-center justify-between"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-lg object-cover bg-zinc-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0 pr-2">
                        <span className="text-[10px] font-bold text-red-600 block uppercase">
                          {isItemTraining ? 'Program Training' : item.product.brand}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-zinc-900 truncate">
                          {item.product.name}
                        </h4>
                        {item.selectedVariant && (
                          <p className="text-[11px] text-zinc-500 truncate">
                            Pilihan: <span className="font-medium text-zinc-800">{item.selectedVariant}</span>
                          </p>
                        )}
                        <p className="text-xs font-extrabold text-zinc-900 tabular-nums mt-0.5">
                          {formatRupiah(item.product.price)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-zinc-400 hover:text-red-600 p-1 transition"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <div className="flex items-center border border-zinc-300 rounded-md bg-white">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 rounded-l"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-bold tabular-nums text-zinc-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs font-bold text-zinc-700 hover:bg-zinc-100 rounded-r"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Customer & Registration Information Form */}
              <div className="space-y-3 pt-2 border-t border-zinc-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Data Pemesan / Peserta Training
                  </h3>
                </div>

                {formError && (
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Customer Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="Nama Anda"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                      No. WhatsApp Aktif *
                    </label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="08123456789"
                      className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    Kota / Kabupaten Domisili *
                  </label>
                  <input
                    type="text"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    placeholder="Contoh: Bandung, Surabaya, Medan, Jakarta"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                    required
                  />
                </div>

                {/* If contains training */}
                {hasTraining && (
                  <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-900">
                      <GraduationCap className="w-4 h-4 text-red-600" />
                      <span>Data Program Training Montir</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                        Tujuan Mengikuti Kursus:
                      </label>
                      <select
                        value={customer.participantPurpose}
                        onChange={(e) => setCustomer({ ...customer, participantPurpose: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-red-300 rounded-lg focus:outline-none focus:border-red-600 text-zinc-800"
                      >
                        <option value="Ingin Buka Usaha Bengkel Mandiri">Ingin Buka Usaha Bengkel Mandiri</option>
                        <option value="Upgrade Skill Injeksi & Kelistrikan Motor">Upgrade Skill Injeksi & Kelistrikan Motor</option>
                        <option value="Persiapan Kerja di Bengkel Resmi / Swasta">Persiapan Kerja di Bengkel Resmi / Swasta</option>
                        <option value="Hobi & Modifikasi Motor Sendiri">Hobi & Modifikasi Motor Sendiri</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                        Pilihan Jadwal Batch:
                      </label>
                      <input
                        type="text"
                        value={customer.preferredBatchSchedule}
                        onChange={(e) => setCustomer({ ...customer, preferredBatchSchedule: e.target.value })}
                        placeholder="Misal: Batch Bulan Depan / Kelas Akhir Pekan"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-red-300 rounded-lg focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                )}

                {/* If contains sparepart */}
                {hasSparepart && (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                        Nama Bengkel / Toko Anda (Opsional jika Grosir):
                      </label>
                      <input
                        type="text"
                        value={customer.storeOrWorkshopName}
                        onChange={(e) => setCustomer({ ...customer, storeOrWorkshopName: e.target.value })}
                        placeholder="Contoh: Bengkel Barokah Motor"
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                        Alamat Pengiriman Sparepart:
                      </label>
                      <textarea
                        rows={2}
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="Alamat lengkap tujuan kirim paket atau cantumkan 'Ambil di Gudang'"
                        className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Method */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    Metode Pembayaran Pilihan
                  </label>
                  <select
                    value={customer.paymentMethod}
                    onChange={(e) => setCustomer({ ...customer, paymentMethod: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600 text-zinc-800 font-medium"
                  >
                    <option value="Transfer BCA">Transfer Bank BCA</option>
                    <option value="Transfer Mandiri">Transfer Bank Mandiri</option>
                    <option value="QRIS">QRIS</option>
                    {hasTraining && <option value="DP Training 50%">DP Training 50% (Pelunasan Hari Pertama)</option>}
                    <option value="Bayar di Workshop">Bayar di Workshop GO OTOMOTIF</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    Catatan Tambahan untuk Admin
                  </label>
                  <input
                    type="text"
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    placeholder="Misal: butuh info penginapan dekat training / packing kayu sparepart"
                    className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* WhatsApp Message Preview Toggle */}
              <div className="pt-2 border-t border-zinc-200">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-xs text-zinc-600 hover:text-zinc-900 flex items-center justify-between w-full p-2 bg-zinc-100 rounded-lg"
                >
                  <span className="font-semibold">
                    {showPreview ? 'Sembunyikan Pratinjau Teks WhatsApp' : 'Lihat Pratinjau Format Pesan WA'}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {showPreview ? '▲' : '▼'}
                  </span>
                </button>

                {showPreview && (
                  <div className="mt-2 p-3 bg-zinc-900 text-zinc-100 text-[11px] font-mono rounded-lg relative overflow-hidden">
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="absolute top-2 right-2 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded flex items-center gap-1 text-[10px]"
                    >
                      {copiedMessage ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedMessage ? 'Disalin' : 'Salin'}</span>
                    </button>
                    <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed max-h-48 overflow-y-auto pr-8">
                      {previewMessage}
                    </pre>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Bar */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-zinc-900">Total Biaya Estimasi</span>
              <span className="text-lg font-black text-red-600 tabular-nums">
                {formatRupiah(totalBiaya)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSendOrder}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Kirim Pesanan & Pendaftaran ke WhatsApp</span>
            </button>

            <p className="text-[10px] text-center text-zinc-400">
              Admin GO OTOMOTIF: +{storeSettings.whatsappNumber} ({storeSettings.storeName})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
