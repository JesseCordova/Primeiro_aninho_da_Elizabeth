import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  UserCheck,
  UserX,
  Copy,
  Check,
  Trash2,
  HeartHandshake,
  Download,
  Lock,
  Settings,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Save,
} from 'lucide-react';
import { GuestConfirmation, PartyDetails } from '../types';

interface HostDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLock?: () => void;
  guests: GuestConfirmation[];
  party: PartyDetails;
  onSaveParty: (updated: PartyDetails) => void;
  onDeleteGuest: (id: string) => void;
  onClearAll: () => void;
}

export const HostDrawer: React.FC<HostDrawerProps> = ({
  isOpen,
  onClose,
  onLock,
  guests,
  party,
  onSaveParty,
  onDeleteGuest,
  onClearAll,
}) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'party'>('guests');
  const [filter, setFilter] = useState<'all' | 'attending' | 'declined'>('all');
  const [copied, setCopied] = useState(false);
  const [partySavedFeedback, setPartySavedFeedback] = useState(false);

  // Editable party state
  const [formData, setFormData] = useState<PartyDetails>(party);

  useEffect(() => {
    setFormData(party);
  }, [party]);

  if (!isOpen) return null;

  const confirmedGuests = guests.filter((g) => g.attending);
  const declinedGuests = guests.filter((g) => !g.attending);

  // Total people = confirmed main guests + their companions
  const totalConfirmedPeople = confirmedGuests.reduce(
    (acc, g) => acc + 1 + (g.companionsCount || 0),
    0
  );
  const totalCompanions = confirmedGuests.reduce(
    (acc, g) => acc + (g.companionsCount || 0),
    0
  );

  const displayedGuests = guests.filter((g) => {
    if (filter === 'attending') return g.attending;
    if (filter === 'declined') return !g.attending;
    return true;
  });

  const handleCopyFormattedList = () => {
    let text = `🎂 *LISTA DE PRESENÇA - ANIVERSÁRIO DA ${party.childName.toUpperCase()}*\n`;
    text += `📅 Data: ${party.date} às ${party.time}\n`;
    text += `📍 Local: ${party.locationName}\n`;
    text += `---------------------------------\n`;
    text += `✨ *RESUMO:*\n`;
    text += `• Total de Pessoas Confirmadas: ${totalConfirmedPeople}\n`;
    text += `• Convidados Principais: ${confirmedGuests.length}\n`;
    text += `• Total de Acompanhantes: ${totalCompanions}\n`;
    text += `• Não poderão ir: ${declinedGuests.length}\n`;
    text += `---------------------------------\n\n`;

    text += `🎉 *CONFIRMADOS (${totalConfirmedPeople} pessoas):*\n`;
    confirmedGuests.forEach((g, idx) => {
      text += `${idx + 1}. *${g.fullName}* (+${g.companionsCount || 0} acompanhante${g.companionsCount === 1 ? '' : 's'})`;
      if (g.companionsNames) {
        text += `\n   ↳ _Acompanhantes:_ ${g.companionsNames}`;
      }
      text += `\n`;
    });

    if (declinedGuests.length > 0) {
      text += `\n🥺 *NÃO PODERÃO IR:*\n`;
      declinedGuests.forEach((g, idx) => {
        text += `${idx + 1}. ${g.fullName}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = [
      'Nome Completo',
      'Comparecerá?',
      'Acompanhantes',
      'Nomes Acompanhantes',
      'Data Confirmação',
    ];
    const rows = guests.map((g) => [
      `"${g.fullName.replace(/"/g, '""')}"`,
      g.attending ? 'Sim' : 'Não',
      g.companionsCount,
      `"${(g.companionsNames || '').replace(/"/g, '""')}"`,
      new Date(g.createdAt).toLocaleDateString('pt-BR'),
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `convidados_${party.childName.toLowerCase().replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSavePartyForm = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveParty(formData);
    setPartySavedFeedback(true);
    setTimeout(() => setPartySavedFeedback(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-[#FBCFE8] overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#FFF0F5] via-[#FFE4EC] to-[#FFF0F5] border-b border-[#FBCFE8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FFA6CE] text-white">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#831843] text-lg font-['Fredoka',sans-serif]">
                  Área do Anfitrião
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFE4EC] text-[#9D174D] text-[10px] font-bold border border-[#FBCFE8]">
                  Desbloqueado
                </span>
              </div>
              <p className="text-xs text-[#86405F]">
                Gerenciamento exclusivo da festa de 1 aninho da {party.childName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {onLock && (
              <button
                type="button"
                onClick={onLock}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#FFE4EC] text-[#9D174D] border border-[#FBCFE8] text-xs font-semibold transition-colors flex items-center gap-1"
                title="Bloquear painel"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bloquear</span>
              </button>
            )}
            <button
              id="btn-close-host-drawer"
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white text-[#9D174D] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation (Convidados / Personalização) */}
        <div className="flex border-b border-[#FCE7F3] bg-[#FFF5F8] px-6 pt-2">
          <button
            id="tab-guests"
            type="button"
            onClick={() => setActiveTab('guests')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'guests'
                ? 'border-[#FF80BF] text-[#831843] bg-white rounded-t-xl'
                : 'border-transparent text-[#86405F] hover:text-[#831843]'
            }`}
          >
            <Users className="w-4 h-4 text-[#DB2777]" />
            <span>Lista de Convidados</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#FFA6CE] text-white text-[10px]">
              {totalConfirmedPeople}
            </span>
          </button>

          <button
            id="tab-party-customization"
            type="button"
            onClick={() => setActiveTab('party')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'party'
                ? 'border-[#FF80BF] text-[#831843] bg-white rounded-t-xl'
                : 'border-transparent text-[#86405F] hover:text-[#831843]'
            }`}
          >
            <Settings className="w-4 h-4 text-[#DB2777]" />
            <span>Personalizar Festa</span>
          </button>
        </div>

        {/* TAB 1: GUEST LIST */}
        {activeTab === 'guests' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 px-6 py-3 bg-[#FFF5F8] border-b border-[#FCE7F3] text-center">
              <div className="p-2.5 rounded-2xl bg-white border border-[#FCE7F3]">
                <span className="block text-[11px] font-bold text-[#9D174D] uppercase">
                  Total de Pessoas
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#831843] font-['Fredoka',sans-serif]">
                  {totalConfirmedPeople}
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-[#FCE7F3]">
                <span className="block text-[11px] font-bold text-[#9D174D] uppercase">
                  Confirmados
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#059669] font-['Fredoka',sans-serif]">
                  {confirmedGuests.length}
                </span>
                <span className="block text-[10px] text-[#86405F]">+{totalCompanions} acomp.</span>
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-[#FCE7F3]">
                <span className="block text-[11px] font-bold text-[#9D174D] uppercase">
                  Não Poderão Ir
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#E11D48] font-['Fredoka',sans-serif]">
                  {declinedGuests.length}
                </span>
              </div>
            </div>

            {/* Actions bar (Filter + Export) */}
            <div className="px-6 py-3 border-b border-[#FCE7F3] flex flex-wrap items-center justify-between gap-2">
              {/* Filters */}
              <div className="flex items-center gap-1 bg-[#FFF0F5] p-1 rounded-xl border border-[#FBCFE8]">
                <button
                  id="filter-all"
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filter === 'all'
                      ? 'bg-white text-[#831843] shadow-2xs'
                      : 'text-[#86405F] hover:text-[#831843]'
                  }`}
                >
                  Todos ({guests.length})
                </button>
                <button
                  id="filter-attending"
                  type="button"
                  onClick={() => setFilter('attending')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filter === 'attending'
                      ? 'bg-white text-[#059669] shadow-2xs'
                      : 'text-[#86405F] hover:text-[#059669]'
                  }`}
                >
                  Confirmados ({confirmedGuests.length})
                </button>
                <button
                  id="filter-declined"
                  type="button"
                  onClick={() => setFilter('declined')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    filter === 'declined'
                      ? 'bg-white text-[#E11D48] shadow-2xs'
                      : 'text-[#86405F] hover:text-[#E11D48]'
                  }`}
                >
                  Não vão ({declinedGuests.length})
                </button>
              </div>

              {/* Quick Copy / Download */}
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-copy-list"
                  type="button"
                  onClick={handleCopyFormattedList}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFE4EC] hover:bg-[#FFD1DC] text-[#9D174D] border border-[#FBCFE8] text-xs font-bold transition-all shadow-2xs"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? 'Copiado!' : 'Copiar p/ WhatsApp'}</span>
                </button>

                <button
                  id="btn-download-csv"
                  type="button"
                  onClick={handleDownloadCsv}
                  className="p-1.5 rounded-xl bg-white hover:bg-[#FFE4EC] text-[#9D174D] border border-[#FBCFE8] text-xs transition-colors"
                  title="Baixar lista em formato Excel/CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Guest List Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {displayedGuests.length === 0 ? (
                <div className="text-center py-12 text-[#86405F]">
                  <HeartHandshake className="w-12 h-12 mx-auto text-[#FFA6CE] mb-2 stroke-[1.5]" />
                  <p className="font-semibold text-sm">Nenhuma confirmação encontrada.</p>
                  <p className="text-xs text-[#B58399] mt-0.5">
                    As respostas enviadas no formulário aparecerão aqui!
                  </p>
                </div>
              ) : (
                displayedGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-4 rounded-2xl bg-white border border-[#FCE7F3] hover:border-[#FFA6CE] transition-all shadow-2xs flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#4A2033]">{guest.fullName}</span>
                        {guest.attending ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#15803D] text-[11px] font-bold">
                            <UserCheck className="w-3 h-3" /> Confirmado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFE4E6] text-[#BE123C] text-[11px] font-bold">
                            <UserX className="w-3 h-3" /> Não irá
                          </span>
                        )}
                      </div>

                      {guest.attending && (
                        <div className="text-xs text-[#831843]">
                          <span className="font-semibold">
                            Acompanhantes:{' '}
                            <strong className="text-[#DB2777]">
                              {guest.companionsCount} pessoa(s)
                            </strong>
                          </span>
                          {guest.companionsNames && (
                            <span className="text-[#86405F] ml-1">
                              ({guest.companionsNames})
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-[10px] text-[#B58399]">
                        Confirmado em {new Date(guest.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteGuest(guest.id)}
                      className="p-1.5 rounded-lg text-[#B58399] hover:text-[#E11D48] hover:bg-[#FFF1F2] transition-colors"
                      title="Remover confirmação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer info & Clear button */}
            <div className="px-6 py-3 bg-[#FFF5F8] border-t border-[#FCE7F3] flex items-center justify-between text-xs text-[#86405F]">
              <span>Dados salvos de forma protegida para o organizador.</span>
              {guests.length > 0 && (
                <button
                  id="btn-clear-all-guests"
                  type="button"
                  onClick={onClearAll}
                  className="text-[#E11D48] hover:underline font-semibold"
                >
                  Limpar lista
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PARTY CUSTOMIZATION */}
        {activeTab === 'party' && (
          <form
            onSubmit={handleSavePartyForm}
            className="flex-1 flex flex-col min-h-0 overflow-y-auto p-6 space-y-4"
          >
            {partySavedFeedback && (
              <div className="p-3 rounded-2xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#15803D] text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>Dados da festa atualizados com sucesso!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1">
                  Nome da Criança
                </label>
                <input
                  type="text"
                  required
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                  placeholder="Ex: Elizabeth"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1">
                  Idade / Comemoração
                </label>
                <input
                  type="text"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                  placeholder="Ex: 1 aninho"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1">
                Frase de Destaque / Tema
              </label>
              <input
                type="text"
                value={formData.themeTitle}
                onChange={(e) => setFormData({ ...formData, themeTitle: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                placeholder="Ex: Primeiro aninho da Elizabeth"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1">
                  Data do Evento
                </label>
                <input
                  type="text"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                  placeholder="Ex: Sábado, 24 de Outubro de 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1">
                  Horário
                </label>
                <input
                  type="text"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                  placeholder="Ex: 16:00"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1">
                Nome do Local
              </label>
              <input
                type="text"
                required
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                placeholder="Ex: Espaço Doce Encanto"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1">
                Endereço Completo
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                placeholder="Ex: Rua das Flores, 120 - Jardim Primavera"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1">
                  Prazo Limite p/ Confirmação (RSVP)
                </label>
                <input
                  type="text"
                  required
                  value={formData.rsvpDeadline}
                  onChange={(e) => setFormData({ ...formData, rsvpDeadline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                  placeholder="Ex: 18 de Outubro"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1">
                  WhatsApp para Dúvidas
                </label>
                <input
                  type="text"
                  value={formData.whatsappContact}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsappContact: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                  placeholder="Ex: 5511999998888"
                />
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                id="btn-save-party-details"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF80BF] to-[#FFA6CE] text-white font-bold text-sm shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Informações da Festa</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
