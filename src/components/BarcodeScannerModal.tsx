import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Product } from '../types';
import { playScannerBeep } from '../utils/barcode';
import { 
  X, 
  Scan, 
  Camera, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  Sparkles,
  Zap
} from 'lucide-react';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductFound: (product: Product) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductFound,
}) => {
  const [manualCode, setManualCode] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [notFoundMsg, setNotFoundMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const manualInputRef = useRef<HTMLInputElement>(null);

  // Search logic for scanned barcode or part number
  const handleProcessBarcode = useCallback((rawCode: string) => {
    if (!rawCode || !rawCode.trim()) return;

    const query = rawCode.trim().toLowerCase();
    const cleanQuery = query.replace(/[^a-z0-9]/gi, '');

    // 1. Exact match by partNumber, barcode, or sku
    let match = products.find(p => {
      const pNum = (p.partNumber || p.specs?.partNumber || '').toLowerCase();
      const pBarcode = (p.barcode || '').toLowerCase();
      const pSku = p.sku.toLowerCase();

      return (
        pNum === query || 
        pBarcode === query || 
        pSku === query ||
        (cleanQuery && pNum.replace(/[^a-z0-9]/gi, '') === cleanQuery) ||
        (cleanQuery && pBarcode === cleanQuery) ||
        (cleanQuery && pSku.replace(/[^a-z0-9]/gi, '') === cleanQuery)
      );
    });

    // 2. Partial match if not found exactly
    if (!match) {
      match = products.find(p => {
        const pNum = (p.partNumber || p.specs?.partNumber || '').toLowerCase();
        const pName = p.name.toLowerCase();
        return pNum.includes(query) || pName.includes(query) || query.includes(pNum);
      });
    }

    if (match) {
      playScannerBeep();
      setNotFoundMsg(null);
      stopCamera();
      onProductFound(match);
      onClose();
    } else {
      setNotFoundMsg(`Kode "${rawCode}" tidak terdaftar di katalog suku cadang. Silakan periksa kembali atau cari dengan nama barang.`);
    }
  }, [products, onProductFound, onClose]);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    setIsScanning(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Perangkat tidak mendukung akses kamera langsung');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Check if native BarcodeDetector API is supported
      if ('BarcodeDetector' in window) {
        const BarcodeDetectorClass = (window as unknown as { BarcodeDetector: any }).BarcodeDetector;
        const detector = new BarcodeDetectorClass({
          formats: ['code_128', 'ean_13', 'qr_code', 'code_39', 'data_matrix']
        });

        const scanLoop = async () => {
          if (!streamRef.current || !videoRef.current) return;
          try {
            if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
              const barcodes = await detector.detect(videoRef.current);
              if (barcodes.length > 0) {
                const detectedValue = barcodes[0].rawValue;
                handleProcessBarcode(detectedValue);
                return; // Stop scan loop on success
              }
            }
          } catch {
            // Ignore frame detection errors
          }
          if (streamRef.current) {
            requestAnimationFrame(scanLoop);
          }
        };
        requestAnimationFrame(scanLoop);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Kamera tidak dapat diakses';
      setCameraError(message);
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
      setTimeout(() => {
        manualInputRef.current?.focus();
      }, 300);
    } else {
      stopCamera();
      setManualCode('');
      setNotFoundMsg(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleProcessBarcode(manualCode.trim());
    }
  };

  // Sample quick test barcodes
  const sampleParts = [
    { label: 'V-Belt BeAT K44', code: '23100-K44-V01', barcode: '8992775102014' },
    { label: 'Busi Iridium CPR9', code: 'CPR9EAIX-9', barcode: '8994512093817' },
    { label: 'Oli MPX2 Honda', code: '08232-M99-K8NZ1', barcode: '8991389201994' },
    { label: 'Aki GTZ-5S MF', code: 'GTZ-5S-12V', barcode: '8996001293812' },
    { label: 'Paket Buka Bengkel', code: 'GO-MOD-PKG120', barcode: '8997012300025' },
    { label: 'Training Injeksi', code: 'GO-TRN-INJ01', barcode: '8997012300018' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div 
        className="w-full max-w-lg bg-zinc-900 text-white rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
              <Scan className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Scan Barcode / QR Spare Part</span>
                <span className="text-[10px] bg-red-950 text-red-400 font-bold px-1.5 py-0.5 rounded border border-red-800">
                  Live Scanner
                </span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                Arahkan kamera ke barcode kemasan barang atau masukkan kode
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Scanner"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Viewport / Scanning Area */}
        <div className="relative bg-black aspect-video sm:aspect-[16/10] flex items-center justify-center overflow-hidden">
          {isScanning && !cameraError ? (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                <div className="relative w-64 h-36 sm:w-72 sm:h-40 border-2 border-red-500/60 rounded-xl overflow-hidden shadow-2xl">
                  {/* Glowing Laser Scan Line */}
                  <div className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" 
                       style={{ 
                         animation: 'scanLaser 2s ease-in-out infinite alternate',
                         top: '50%'
                       }} 
                  />

                  {/* Corner Targets */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white" />

                  <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span className="text-[10px] bg-black/70 text-zinc-200 px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
                      Arahkan barcode ke dalam kotak
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 text-center space-y-3 max-w-sm">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-200">
                  {cameraError ? 'Kamera Belum Aktif' : 'Menyiapkan Pemindai...'}
                </p>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  Gunakan kolom pencarian di bawah untuk mengetik kode part atau pilih sampel suku cadang di bawah untuk menguji pemindaian otomatis.
                </p>
              </div>
              <button
                type="button"
                onClick={startCamera}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg border border-zinc-700 transition"
              >
                Coba Nyalakan Kamera Ulang
              </button>
            </div>
          )}
        </div>

        {/* Error / Not Found Alert */}
        {notFoundMsg && (
          <div className="mx-4 mt-3 p-3 bg-red-950/80 border border-red-800 text-red-200 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{notFoundMsg}</span>
          </div>
        )}

        {/* Manual Barcode / Hardware Scanner Input Form */}
        <div className="p-4 sm:p-5 space-y-4">
          <form onSubmit={handleManualSubmit} className="space-y-2">
            <label className="block text-xs font-bold text-zinc-300">
              Ketik Kode Part / Scan dengan Scanner Laser Fisik
            </label>
            <div className="relative flex items-center">
              <input
                ref={manualInputRef}
                type="text"
                value={manualCode}
                onChange={(e) => {
                  setManualCode(e.target.value);
                  setNotFoundMsg(null);
                }}
                placeholder="Contoh: 23100-K44-V01, CPR9, atau 899..."
                className="w-full pl-3 pr-24 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs font-mono tracking-wider focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-zinc-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari Part</span>
              </button>
            </div>
            <p className="text-[10px] text-zinc-500">
              Mendukung input otomatis barcode scanner USB/Bluetooth bengkel (cukup tembak barcode pada kemasan barang).
            </p>
          </form>

          {/* Quick Clickable Presets for Testing */}
          <div className="pt-3 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-red-500" />
                Coba Scan Cepat (Klik Salah Satu Barcode):
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {sampleParts.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleProcessBarcode(item.code)}
                  className="p-2 bg-zinc-800 hover:bg-zinc-750 hover:border-red-500/70 border border-zinc-700 rounded-lg text-left transition group"
                >
                  <div className="text-[11px] font-bold text-white group-hover:text-red-400 truncate">
                    {item.label}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400 truncate">
                    {item.code}
                  </div>
                  <div className="text-[9px] text-zinc-500 truncate mt-0.5 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-amber-500" />
                    <span>Scan Instan</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-center text-[11px] text-zinc-500 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Barang yang ditemukan akan otomatis terbuka dengan detail spesifikasi & harga</span>
        </div>
      </div>
    </div>
  );
};
