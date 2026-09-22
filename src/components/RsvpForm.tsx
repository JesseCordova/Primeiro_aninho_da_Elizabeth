import React, { useState } from 'react';
import { User, Users, Heart, Send, AlertCircle, Plus, Minus, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GuestConfirmation, PartyDetails } from '../types';

interface RsvpFormProps {
  party: PartyDetails;
  onSuccess: (confirmation: GuestConfirmation) => Promise<void>;
}

export const RsvpForm: React.FC<RsvpFormProps> = ({ party, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [attending, setAttending] = useState(true);
  const [companionsCount, setCompanionsCount] = useState<number>(0);
  const [companionsNames, setCompanionsNames] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIncrement = () => {
    if (companionsCount < 15) {
      setCompanionsCount((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (companionsCount > 0) {
      setCompanionsCount((prev) => prev - 1);
    }
  };

  const handleDecline = () => {
    setAttending(false);
    setCompanionsCount(0);
    setCompanionsNames('');
    setError(null);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFA6CE', '#FF80BF', '#FFD1DC', '#FCE7F3', '#FF65A3', '#FFFFFF'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setError('Por favor, informe seu nome completo.');
      return;
    }

    if (trimmedName.split(' ').length < 2) {
      setError('Por favor, digite seu nome e sobrenome completo.');
      return;
    }

    setIsSubmitting(true);

    const finalCompanions = attending ? Math.max(0, companionsCount) : 0;

    const newConfirmation: GuestConfirmation = {
      id: 'guest-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      fullName: trimmedName,
      attending,
      companionsCount: finalCompanions,
      createdAt: new Date().toISOString(),
    };

    if (attending && finalCompanions > 0 && companionsNames.trim()) {
      newConfirmation.companionsNames = companionsNames.trim();
    }

    // Confetti on positive attendance
    if (attending) {
      triggerConfetti();
    }

    try {
      await onSuccess(newConfirmation);
      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
      setError('Não foi possível gravar sua confirmação. Tente novamente em instantes.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border border-[#FBCFE8]">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-2xl bg-[#FFF0F5] border border-[#FFD6E0] text-[#E11D48] mb-2">
          <Heart className="w-6 h-6 fill-[#FFA6CE] text-[#E11D48]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#831843] font-['Fredoka',sans-serif]">
          Confirmar Presença
        </h2>
        <p className="text-sm text-[#86405F] mt-1">
          Preencha os campos abaixo para que possamos organizar tudo com muito carinho.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] text-[#9F1239] text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#E11D48]" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Attendance choice (Yes / No) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-2">
            Você poderá comparecer?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="btn-attending-yes"
              onClick={() => setAttending(true)}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 font-semibold text-sm transition-all ${
                attending
                  ? 'border-[#FF80BF] bg-[#FFEBF3] text-[#831843] shadow-xs'
                  : 'border-[#FCE7F3] bg-white text-[#86405F] hover:bg-[#FFF5F8]'
              }`}
            >
              <span className="text-lg">🎉</span>
              <span>Sim, com certeza!</span>
            </button>

            <button
              type="button"
              id="btn-attending-no"
              onClick={handleDecline}
              className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border-2 font-semibold text-sm transition-all ${
                !attending
                  ? 'border-[#FDA4AF] bg-[#FFF1F2] text-[#9F1239] shadow-xs'
                  : 'border-[#FCE7F3] bg-white text-[#86405F] hover:bg-[#FFF5F8]'
              }`}
            >
              <span className="text-lg">🥺</span>
              <span>Não poderei ir</span>
            </button>
          </div>
        </div>

        {/* Nome Completo (Mandatory) */}
        <div>
          <label htmlFor="full-name" className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1.5">
            Seu Nome Completo <span className="text-[#E11D48]">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#F472B6]">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="full-name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex: Maria Carolina Silva"
              required
              className="w-full pl-11 pr-4 py-3 bg-[#FFF5F8]/60 border border-[#FBCFE8] focus:border-[#FF80BF] focus:bg-white focus:ring-3 focus:ring-[#FF80BF]/20 rounded-2xl text-sm text-[#5C3A48] placeholder-[#B58399] outline-none transition-all"
            />
          </div>
        </div>

        {/* Quantidade de pessoas que vão acompanhar */}
        {attending && (
          <div className="p-4 rounded-2xl bg-[#FFF5F8] border border-[#FCE7F3] transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D]">
                  Pessoas que vão acompanhar você
                </label>
                <p className="text-xs text-[#86405F] mt-0.5">
                  (Além de você, quantas pessoas irão juntas?)
                </p>
              </div>

              {/* Number Stepper */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <button
                  type="button"
                  id="btn-decrement-companions"
                  onClick={handleDecrement}
                  disabled={companionsCount <= 0}
                  className="w-10 h-10 rounded-xl bg-white border border-[#FBCFE8] text-[#9D174D] flex items-center justify-center hover:bg-[#FFE4EC] disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all shadow-2xs"
                  aria-label="Diminuir acompanhantes"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="min-w-[48px] text-center">
                  <span id="companions-display" className="text-2xl font-black text-[#831843] font-['Fredoka',sans-serif]">
                    {companionsCount}
                  </span>
                </div>

                <button
                  type="button"
                  id="btn-increment-companions"
                  onClick={handleIncrement}
                  disabled={companionsCount >= 15}
                  className="w-10 h-10 rounded-xl bg-[#FFA6CE] border border-[#FF80BF] text-white flex items-center justify-center hover:bg-[#FF80BF] active:scale-95 transition-all shadow-2xs"
                  aria-label="Aumentar acompanhantes"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total Headcount Summary Pill */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#FCE7F3] text-xs font-semibold text-[#9D174D]">
              <Users className="w-4 h-4 text-[#FF80BF]" />
              <span>
                Total no seu grupo:{' '}
                <strong className="text-[#831843] text-sm font-bold">
                  {companionsCount + 1} {companionsCount === 0 ? 'pessoa (apenas você)' : `pessoas (você + ${companionsCount})`}
                </strong>
              </span>
            </div>

            {/* Nomes dos acompanhantes (opcional quando tem acompanhantes) */}
            {companionsCount > 0 && (
              <div className="mt-3 pt-3 border-t border-[#FCE7F3]">
                <label htmlFor="companions-names" className="block text-xs font-semibold text-[#831843] mb-1">
                  Nome dos acompanhantes (opcional)
                </label>
                <input
                  type="text"
                  id="companions-names"
                  value={companionsNames}
                  onChange={(e) => setCompanionsNames(e.target.value)}
                  placeholder="Ex: João (esposo), Clara (filha 3 anos)"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-xs text-[#5C3A48] placeholder-[#B58399] outline-none transition-all"
                />
              </div>
            )}
          </div>
        )}

        {/* Submit Button in Candy Pink / Rosa Bebê */}
        <button
          type="submit"
          id="btn-submit-rsvp"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF80BF] via-[#FFA6CE] to-[#FF80BF] hover:opacity-95 text-white font-bold text-base shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Gravando confirmação...</span>
            </span>
          ) : (
            <>
              {attending ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Send className="w-4 h-4" />}
              <span>{attending ? 'Confirmar Presença Agora 💕' : 'Enviar Resposta'}</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-[#86405F]">
          Sua resposta ajuda os papais a prepararem a festa perfeita! 🎂
        </p>
      </form>
    </div>
  );
};
