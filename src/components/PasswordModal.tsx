import React, { useState } from 'react';
import { Lock, Eye, EyeOff, X, KeyRound, AlertCircle } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const REQUIRED_PASSWORD = '159753';

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === REQUIRED_PASSWORD) {
      setError(null);
      setPassword('');
      onSuccess();
    } else {
      setError('Senha incorreta! Acesso permitido apenas ao anfitrião.');
    }
  };

  const handleClose = () => {
    setPassword('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#FBCFE8] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#FFF0F5] via-[#FFE4EC] to-[#FFF0F5] border-b border-[#FBCFE8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FFA6CE] text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-[#831843] text-base font-['Fredoka',sans-serif]">
                Acesso do Anfitrião
              </h3>
              <p className="text-[11px] text-[#86405F]">
                Área restrita aos organizadores
              </p>
            </div>
          </div>
          <button
            id="btn-close-password-modal"
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white text-[#9D174D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-[#86405F] text-center">
            Digite a senha de segurança para visualizar os convidados confirmados:
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-[#9F1239] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#E11D48]" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="host-password-input" className="block text-[11px] font-bold uppercase tracking-wider text-[#9D174D] mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#F472B6]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="host-password-input"
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Digite a senha..."
                className="w-full pl-9 pr-10 py-2.5 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] focus:bg-white focus:ring-2 focus:ring-[#FF80BF]/20 rounded-xl text-sm text-[#5C3A48] placeholder-[#B58399] outline-none transition-all"
              />
              <button
                type="button"
                id="btn-toggle-show-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#B58399] hover:text-[#9D174D]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="w-1/2 py-2.5 rounded-xl border border-[#FBCFE8] text-xs font-semibold text-[#86405F] hover:bg-[#FFF5F8] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-submit-host-password"
              className="w-1/2 py-2.5 rounded-xl bg-gradient-to-r from-[#FF80BF] to-[#FFA6CE] text-white font-bold text-xs shadow-xs hover:opacity-95 transition-all"
            >
              Acessar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
