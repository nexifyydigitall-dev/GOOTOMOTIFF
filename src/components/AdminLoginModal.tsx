import React, { useState } from 'react';
import logoGoOtomotif from '../assets/images/logo_go_otomotif.png';
import { X, Lock, KeyRound, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentPin: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentPin,
}) => {
  if (!isOpen) return null;

  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === currentPin.trim()) {
      setErrorMsg('');
      setPinInput('');
      onSuccess();
    } else {
      setErrorMsg('PIN / Kata Sandi salah. Akses ditolak.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/85 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="w-full max-w-sm bg-zinc-900 text-white rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={logoGoOtomotif} 
              alt="GO Otomotif" 
              className="h-7 w-auto object-contain"
            />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Akses Rahasia Pengelola</h3>
              <p className="text-[10px] text-zinc-400">Khusus Pemilik GO OTOMOTIF</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Menu pengubahan katalog disembunyikan dari publik. Masukkan PIN keamanan untuk mengakses panel kelola data.
          </p>

          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-950/80 border border-red-800 text-red-300 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">
              PIN Keamanan Admin
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Masukkan PIN (Default: 8888)"
                className="w-full pl-9 pr-10 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-xs font-mono tracking-wider focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-zinc-600"
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-200"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1.5">
              PIN bawaan: <span className="font-mono text-zinc-400 font-bold">8888</span> (Dapat diganti di dalam panel).
            </p>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition shadow-sm"
            >
              Buka Panel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
