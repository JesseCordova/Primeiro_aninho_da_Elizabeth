import React, { useState } from 'react';
import { X, Save, PartyPopper } from 'lucide-react';
import { PartyDetails } from '../types';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  party: PartyDetails;
  onSave: (updated: PartyDetails) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  onClose,
  party,
  onSave,
}) => {
  const [formData, setFormData] = useState<PartyDetails>({ ...party });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#FBCFE8] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#FFF0F5] via-[#FFE4EC] to-[#FFF0F5] border-b border-[#FBCFE8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#FFA6CE] text-white">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#831843] text-lg font-['Fredoka',sans-serif]">
                Personalizar Aniversário
              </h3>
              <p className="text-xs text-[#86405F]">
                Altere o nome, idade, data e endereço do evento
              </p>
            </div>
          </div>
          <button
            id="btn-close-edit-modal"
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white text-[#9D174D] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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
                placeholder="Ex: Helena"
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
                Data
              </label>
              <input
                type="text"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                placeholder="Ex: Sábado, 24 de Outubro"
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
              placeholder="Ex: Buffet Doce Encanto"
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
              placeholder="Ex: Rua das Flores, 120 - Bairro Primavera"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1">
                Prazo Limite p/ RSVP
              </label>
              <input
                type="text"
                value={formData.rsvpDeadline || ''}
                onChange={(e) => setFormData({ ...formData, rsvpDeadline: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                placeholder="Ex: 18 de Outubro"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#9D174D] mb-1">
                WhatsApp dos Pais (DDD + Número)
              </label>
              <input
                type="text"
                value={formData.whatsappContact}
                onChange={(e) => setFormData({ ...formData, whatsappContact: e.target.value })}
                className="w-full px-3 py-2 bg-[#FFF5F8] border border-[#FBCFE8] focus:border-[#FF80BF] rounded-xl text-sm text-[#5C3A48] outline-none"
                placeholder="Ex: 5511999998888"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#86405F] hover:bg-[#FFF5F8] rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-save-party-details"
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF80BF] to-[#FFA6CE] text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
