import React from 'react';
import { CheckCircle2, RotateCcw, Heart, Users } from 'lucide-react';
import { GuestConfirmation, PartyDetails } from '../types';

interface SuccessStateProps {
  confirmation: GuestConfirmation;
  party: PartyDetails;
  onReset: () => void;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  confirmation,
  party,
  onReset,
}) => {
  const totalPeople = confirmation.attending ? confirmation.companionsCount + 1 : 0;

  return (
    <div className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-[#FBCFE8] text-center">
      {/* Animated Success Badge */}
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#FFE4EC] to-[#FFD1DC] border-2 border-[#FFA6CE] flex items-center justify-center mb-4 shadow-sm animate-bounce">
        {confirmation.attending ? (
          <CheckCircle2 className="w-10 h-10 text-[#DB2777]" />
        ) : (
          <Heart className="w-10 h-10 fill-[#FFA6CE] text-[#DB2777]" />
        )}
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-[#831843] font-['Fredoka',sans-serif] mb-1">
        {confirmation.attending ? 'Presença Confirmada!' : 'Resposta Registrada!'}
      </h2>

      <p className="text-sm text-[#86405F] mb-6">
        {confirmation.attending
          ? `Obrigado, ${confirmation.fullName}! Seu nome já está na nossa lista de convidados.`
          : `Sentiremos sua falta, ${confirmation.fullName}! Obrigado pelo carinho.`}
      </p>

      {/* Confirmation Summary Card */}
      <div className="p-4 rounded-2xl bg-[#FFF5F8] border border-[#FCE7F3] text-left mb-6 space-y-2.5">
        <div className="flex justify-between items-center text-xs pb-2 border-b border-[#FCE7F3]">
          <span className="font-bold uppercase tracking-wider text-[#9D174D]">Convidado Principal:</span>
          <span className="font-bold text-[#4A2033] text-sm">{confirmation.fullName}</span>
        </div>

        {confirmation.attending && (
          <>
            <div className="flex justify-between items-center text-xs pb-2 border-b border-[#FCE7F3]">
              <span className="font-bold uppercase tracking-wider text-[#9D174D]">Acompanhantes:</span>
              <span className="font-semibold text-[#831843] flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#FF80BF]" />
                {confirmation.companionsCount} pessoa(s)
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-[#FCE7F3] bg-[#FFEBF3]/50 p-2 rounded-xl">
              <span className="font-extrabold uppercase tracking-wider text-[#831843]">Total no seu grupo:</span>
              <span className="font-extrabold text-[#831843] text-sm">
                {totalPeople} {totalPeople === 1 ? 'pessoa' : 'pessoas'}
              </span>
            </div>

            {confirmation.companionsNames && (
              <div className="text-xs pt-1">
                <span className="font-bold text-[#9D174D]">Nomes informados:</span>
                <p className="text-[#5C3A48] mt-0.5 italic">{confirmation.companionsNames}</p>
              </div>
            )}
          </>
        )}
      </div>

      {confirmation.attending && (
        <div className="p-4 rounded-2xl bg-[#FFF5F8] border border-[#FCE7F3] text-left mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#9D174D] mb-2">Dicas para o presente e para a festa</h3>
          <ol className="list-decimal list-inside space-y-2 text-xs leading-relaxed text-[#5C3A48]">
            <li>Nossa Elizabeth está utilizando roupa tamanho 2, caso deseje presenteá-la com roupa.</li>
            <li>Além do local onde será servida a comida, o espaço possui um vasto gramado onde as crianças poderão brincar. Sinta-se à vontade para levar roupas ou calçados confortáveis.</li>
          </ol>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          id="btn-reset-form"
          type="button"
          onClick={onReset}
          className="w-full py-2.5 px-4 text-xs font-semibold text-[#86405F] hover:text-[#831843] flex items-center justify-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Confirmar presença para outra pessoa</span>
        </button>
      </div>
    </div>
  );
};
