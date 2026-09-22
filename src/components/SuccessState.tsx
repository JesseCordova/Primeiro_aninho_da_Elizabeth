import React from 'react';
import { CheckCircle2, Calendar, MessageCircle, RotateCcw, Heart, Users, Share2 } from 'lucide-react';
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

  // Format WhatsApp message
  const createWhatsAppUrl = () => {
    let text = '';
    if (confirmation.attending) {
      text = `Olá! Acabei de confirmar presença no aniversário da *${party.childName}*! 🎉\n\n`;
      text += `*Nome:* ${confirmation.fullName}\n`;
      text += `*Pessoas que vão acompanhar:* ${confirmation.companionsCount} acompanhante(s)\n`;
      text += `*Total de pessoas:* ${totalPeople}\n`;
      if (confirmation.companionsNames) {
        text += `*Nomes:* ${confirmation.companionsNames}\n`;
      }
      text += `\nMal podemos esperar! 💕`;
    } else {
      text = `Olá! Infelizmente não poderei comparecer ao aniversário da *${party.childName}*, mas desejo uma festa linda e cheia de amor! 💖\n\n*Nome:* ${confirmation.fullName}`;
    }

    const cleanNumber = party.whatsappContact.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleDownloadCalendar = () => {
    // Generate simple .ics calendar file
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Aniversario Infantil//PT',
      'BEGIN:VEVENT',
      `SUMMARY:Aniversário da ${party.childName} (${party.age})`,
      `DESCRIPTION:Comemoração do aniversário da ${party.childName}. Local: ${party.locationName} - ${party.address}`,
      `LOCATION:${party.locationName}, ${party.address}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `aniversario_${party.childName.toLowerCase().replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

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

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Send to Organizer via WhatsApp */}
        <a
          id="btn-whatsapp-confirmation"
          href={createWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>Avisar no WhatsApp da Família</span>
        </a>

        {confirmation.attending && (
          <button
            id="btn-add-to-calendar"
            type="button"
            onClick={handleDownloadCalendar}
            className="w-full py-3 px-5 rounded-2xl bg-[#FFE4EC] hover:bg-[#FFD6E0] text-[#9D174D] font-bold text-sm border border-[#FBCFE8] transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#DB2777]" />
            <span>Salvar na Minha Agenda (.ics)</span>
          </button>
        )}

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
