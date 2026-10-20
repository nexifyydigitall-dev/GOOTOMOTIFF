import React, { useMemo, useState } from 'react';
import { encodeCode128 } from '../utils/barcode';
import { Copy, Check, Printer } from 'lucide-react';

interface BarcodeRendererProps {
  value: string;
  partNumber?: string;
  productName?: string;
  category?: string;
  price?: number;
  size?: 'sm' | 'md' | 'lg' | 'printable';
  showLabel?: boolean;
  showCopyButton?: boolean;
  showPrintButton?: boolean;
}

export const BarcodeRenderer: React.FC<BarcodeRendererProps> = ({
  value,
  partNumber,
  productName,
  category,
  price,
  size = 'md',
  showLabel = true,
  showCopyButton = true,
  showPrintButton = false,
}) => {
  const [copied, setCopied] = useState(false);

  const displayCode = partNumber || value;
  const binaryBars = useMemo(() => encodeCode128(displayCode), [displayCode]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.print();
  };

  // Dimensions based on size
  const height = size === 'sm' ? 28 : size === 'md' ? 44 : 64;
  const barWidth = size === 'sm' ? 1.2 : size === 'md' ? 1.6 : 2.0;
  const totalSvgWidth = binaryBars.length * barWidth;

  if (size === 'sm') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-zinc-100/90 rounded border border-zinc-200 text-zinc-800">
        <svg 
          viewBox={`0 0 ${totalSvgWidth} ${height}`} 
          className="h-5 w-auto" 
          aria-label={`Barcode ${displayCode}`}
        >
          {binaryBars.split('').map((bit, idx) => 
            bit === '1' ? (
              <rect
                key={idx}
                x={idx * barWidth}
                y={0}
                width={barWidth}
                height={height}
                fill="#18181b"
              />
            ) : null
          )}
        </svg>
        <span className="font-mono text-[10px] font-bold tracking-tight text-zinc-900 select-all">
          {displayCode}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-zinc-200 shadow-xs flex flex-col items-center">
      {showLabel && (
        <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="font-bold text-zinc-700 text-[11px] uppercase tracking-wider">
              Label Resmi Suku Cadang OEM
            </span>
          </div>
          {category && (
            <span className="text-[10px] text-zinc-500 font-semibold truncate max-w-[150px]">
              {category}
            </span>
          )}
        </div>
      )}

      {/* Product Name on label if provided */}
      {productName && (
        <div className="w-full text-center mb-1.5">
          <p className="text-xs font-bold text-zinc-900 truncate">{productName}</p>
        </div>
      )}

      {/* SVG Barcode Graphic */}
      <div className="w-full overflow-x-auto flex justify-center py-1">
        <svg
          viewBox={`0 0 ${totalSvgWidth} ${height}`}
          style={{ height: `${height}px`, width: '100%', maxWidth: `${Math.min(totalSvgWidth, 280)}px` }}
          preserveAspectRatio="none"
          className="mx-auto"
          aria-label={`Barcode ${displayCode}`}
        >
          <rect width={totalSvgWidth} height={height} fill="#ffffff" />
          {binaryBars.split('').map((bit, idx) =>
            bit === '1' ? (
              <rect
                key={idx}
                x={idx * barWidth}
                y={0}
                width={barWidth}
                height={height}
                fill="#09090b"
              />
            ) : null
          )}
        </svg>
      </div>

      {/* Text representation under barcode */}
      <div className="mt-1 flex items-center justify-center gap-2">
        <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-zinc-900 select-all bg-zinc-50 px-2.5 py-0.5 rounded border border-zinc-200">
          {displayCode}
        </span>
      </div>

      {/* Action buttons */}
      <div className="w-full flex items-center justify-between pt-2.5 mt-2.5 border-t border-zinc-100 text-xs">
        {price !== undefined && (
          <span className="text-[11px] text-zinc-500 font-medium">
            Scan untuk cek harga & stok
          </span>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {showCopyButton && (
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded-md transition"
              title="Salin Kode Part"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
          )}

          {showPrintButton && (
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 rounded-md transition"
              title="Cetak Stiker Label"
            >
              <Printer className="w-3 h-3" />
              <span>Cetak Label</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
