import React, { useMemo, useState } from 'react';
import { generateBarcodeSvgMarkup } from '../utils/barcode';
import { formatRupiah } from '../utils/whatsapp';
import { Printer, Copy, Check, QrCode } from 'lucide-react';

interface BarcodeViewProps {
  barcode?: string;
  partNumber?: string;
  sku?: string;
  productName?: string;
  brand?: string;
  price?: number;
  className?: string;
  showPrint?: boolean;
}

export const BarcodeView: React.FC<BarcodeViewProps> = ({
  barcode,
  partNumber,
  sku,
  productName,
  brand = 'GO OTOMOTIF',
  price,
  className = '',
  showPrint = true,
}) => {
  const [copied, setCopied] = useState(false);
  const codeToRender = barcode || partNumber || sku || 'GO-PART-001';

  const svgMarkup = useMemo(() => {
    return generateBarcodeSvgMarkup(codeToRender, 240, 56);
  }, [codeToRender]);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(codeToRender).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    const printWindow = window.open('', '_blank', 'width=420,height=500');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Label Barcode Sparepart - ${productName || codeToRender}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff;
          }
          .label-card {
            border: 2px solid #000;
            border-radius: 8px;
            padding: 16px;
            width: 320px;
            text-align: center;
            box-sizing: border-box;
          }
          .store-name {
            font-size: 14px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #dc2626;
            margin-bottom: 4px;
          }
          .product-name {
            font-size: 13px;
            font-weight: 700;
            color: #111;
            margin: 6px 0;
            line-height: 1.3;
          }
          .part-no {
            font-size: 12px;
            font-family: monospace;
            font-weight: bold;
            background: #f4f4f5;
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
            margin-bottom: 8px;
          }
          .barcode-container {
            margin: 10px 0 6px 0;
          }
          .barcode-number {
            font-family: monospace;
            font-size: 13px;
            letter-spacing: 3px;
            font-weight: bold;
          }
          .price {
            font-size: 16px;
            font-weight: 900;
            margin-top: 8px;
            color: #000;
          }
        </style>
      </head>
      <body>
        <div class="label-card">
          <div class="store-name">${brand.toUpperCase()}</div>
          <div class="product-name">${productName || 'Sparepart Motor'}</div>
          ${partNumber ? `<div class="part-no">KODE PART: ${partNumber}</div>` : ''}
          <div class="barcode-container">
            ${svgMarkup}
          </div>
          <div class="barcode-number">${codeToRender}</div>
          ${price ? `<div class="price">${formatRupiah(price)}</div>` : ''}
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className={`p-3.5 bg-white border border-zinc-200 rounded-xl shadow-xs ${className}`}>
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-1.5 font-bold text-zinc-700">
          <QrCode className="w-3.5 h-3.5 text-red-600" />
          <span>Barcode & Kode Sparepart</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded transition"
            title="Salin Kode Barcode"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {showPrint && (
            <button
              type="button"
              onClick={handlePrint}
              className="p-1 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition"
              title="Cetak Label Barcode Rak / Dus"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scannable Barcode SVG */}
      <div className="bg-white p-2 rounded-lg border border-zinc-100 flex flex-col items-center">
        <div 
          className="w-full max-w-[240px] h-14 flex items-center justify-center overflow-hidden select-none"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
        <span className="font-mono text-xs font-bold tracking-widest text-zinc-800 mt-1">
          {codeToRender}
        </span>
      </div>

      {/* Part Number Details */}
      <div className="mt-2.5 pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-1 text-[11px]">
        {partNumber && (
          <div className="flex items-center gap-1 text-zinc-600">
            <span className="font-semibold text-zinc-500">Kode Part:</span>
            <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">
              {partNumber}
            </span>
          </div>
        )}
        {sku && (
          <div className="flex items-center gap-1 text-zinc-500">
            <span>SKU:</span>
            <span className="font-mono font-medium text-zinc-700">{sku}</span>
          </div>
        )}
      </div>
    </div>
  );
};
