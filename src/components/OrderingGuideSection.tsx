import React from 'react';
import { Search, GraduationCap, MessageSquare, Award } from 'lucide-react';

export const OrderingGuideSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Pilih Sparepart / Program Kursus',
      desc: 'Tentukan suku cadang yang Anda butuhkan (grosir/retail) atau pilih kelas pelatihan montir motor yang ingin diikuti.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Isi Data & Jadwal Batch',
      desc: 'Masukkan data calon peserta training atau alamat pengiriman paket sparepart ke bengkel/toko Anda.',
      icon: GraduationCap,
    },
    {
      step: '03',
      title: 'Kirim via WhatsApp Resmi',
      desc: 'Klik tombol WA. Format pesan otomatis langsung terhubung ke admin GO OTOMOTIF tanpa perlu ketik manual.',
      icon: MessageSquare,
    },
    {
      step: '04',
      title: 'Mulai Belajar & Terima Suplai',
      desc: 'Konfirmasi DP / pembayaran, paket sparepart langsung dikirim dan peserta siap memulai pelatihan intensif.',
      icon: Award,
    },
  ];

  return (
    <section id="cara-pesan" className="bg-zinc-100 border-y border-zinc-200 py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-red-600 mb-1">
            Alur Pemesanan & Pendaftaran
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900">
            Cara Order Sparepart & Daftar Training Montir
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-2">
            Proses mudah dan transparan. Tim konsultan GO OTOMOTIF siap mendampingi Anda dari awal hingga mandiri.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-zinc-200 flex flex-col justify-between hover:border-zinc-300 transition shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-zinc-300 tabular-nums">
                      {item.step}
                    </span>
                    <div className="p-2.5 rounded-lg bg-red-50 text-red-600">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
