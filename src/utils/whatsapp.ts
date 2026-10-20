import { CartItem, CustomerOrderInfo, Product } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cleanWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('62') && cleaned.length >= 9) {
    cleaned = '62' + cleaned;
  }
  return cleaned || '6281234567890';
}

/**
 * Generate formatted WhatsApp message for a single item (Spare Part or Training Montir)
 */
export function createSingleProductWhatsAppMessage(
  product: Product,
  storeName: string,
  variant?: string,
  quantity: number = 1,
  participantName?: string,
  motorcycleModel?: string
): string {
  const subtotal = product.price * quantity;
  const isTraining = product.itemType === 'training';
  const variantText = variant ? `\n• *Pilihan/Jadwal*: ${variant}` : '';
  const motorText = motorcycleModel ? `\n🏍️ *Tipe Motor*: ${motorcycleModel}` : '';
  const participantText = participantName ? `\n👤 *Nama Peserta*: ${participantName}` : '';

  if (isTraining) {
    return [
      `Halo *${storeName}*, saya tertarik dan ingin mendaftar program training montir motor:`,
      '',
      `🎓 *PROGRAM PELATIHAN*: ${product.name}`,
      `• *Kode*: ${product.sku}${variantText}${participantText}`,
      `• *Biaya Pelatihan*: *${formatRupiah(subtotal)}*`,
      product.batchSchedule ? `• *Status Batch*: ${product.batchSchedule}` : '',
      '',
      `Mohon informasi slot kuota kelas yang tersedia dan tata cara pendaftaran / DP ya. Terima kasih! 🙏`
    ].filter(Boolean).join('\n');
  }

  return [
    `Halo *${storeName}*, saya ingin menanyakan / memesan spare part motor berikut:`,
    '',
    `⚙️ *PRODUK / PAKET*: ${product.name}`,
    `• *SKU*: ${product.sku}${variantText}${motorText}`,
    `• *Jumlah*: ${quantity} unit/paket`,
    `• *Estimasi Total*: *${formatRupiah(subtotal)}*`,
    '',
    `Apakah stok barang ini ready? Mohon info ongkos kirim ke kota saya / cara pengambilannya. Terima kasih! 🙏`
  ].join('\n');
}

/**
 * Generate formatted WhatsApp message for full cart (spare parts + training registrations)
 */
export function createCartOrderWhatsAppMessage(
  items: CartItem[],
  customer: CustomerOrderInfo,
  storeName: string
): string {
  const totalBiaya = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const itemListText = items
    .map((item, index) => {
      const typeIcon = item.product.itemType === 'training' ? '🎓' : '⚙️';
      const varInfo = item.selectedVariant ? ` (${item.selectedVariant})` : '';
      const lineTotal = item.product.price * item.quantity;
      return `${index + 1}. ${typeIcon} *${item.product.name}*${varInfo}\n   ${item.quantity} x ${formatRupiah(item.product.price)} = *${formatRupiah(lineTotal)}*`;
    })
    .join('\n\n');

  const hasTraining = items.some(i => i.product.itemType === 'training');
  const hasSparepart = items.some(i => i.product.itemType !== 'training');

  const trainingDetailLines = hasTraining ? [
    `📚 *DATA PENDAFTARAN TRAINING MONTIR*:`,
    `• *Nama Peserta*: ${customer.name || '-'}`,
    customer.participantPurpose ? `• *Tujuan*: ${customer.participantPurpose}` : '',
    customer.preferredBatchSchedule ? `• *Preferensi Waktu*: ${customer.preferredBatchSchedule}` : '',
  ] : [];

  const sparepartDetailLines = hasSparepart ? [
    `📦 *DATA PENGIRIMAN SPAREPART*:`,
    customer.storeOrWorkshopName ? `• *Nama Bengkel / Toko*: ${customer.storeOrWorkshopName}` : '',
    customer.address ? `• *Alamat Pengiriman*: ${customer.address}` : '',
  ] : [];

  return [
    `Halo *${storeName}*, saya ingin konfirmasi pemesanan / pendaftaran dari katalog:`,
    '',
    `📋 *RINCIAN ORDER* (${dateFormatted})`,
    '----------------------------------------',
    itemListText,
    '----------------------------------------',
    `💰 *TOTAL BIAYA ESTIMASI*: *${formatRupiah(totalBiaya)}*`,
    '',
    `👤 *DATA PEMESAN*:`,
    `• *Nama Lengkap*: ${customer.name || '-'}`,
    `• *No. WhatsApp*: ${customer.phone || '-'}`,
    `• *Kota / Domisili*: ${customer.city || '-'}`,
    ...trainingDetailLines,
    ...sparepartDetailLines,
    `• *Pilihan Pembayaran*: ${customer.paymentMethod}`,
    customer.notes ? `• *Catatan Tambahan*: ${customer.notes}` : '',
    '',
    `Mohon segera dicek dan dikonfirmasi admin GO OTOMOTIF ya. Terima kasih!`
  ].filter(line => line !== null && line !== '').join('\n');
}

export function openWhatsAppChat(phone: string, message: string): void {
  const cleanPhone = cleanWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
