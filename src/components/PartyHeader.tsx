import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Cake, Heart, ExternalLink } from 'lucide-react';
import { PartyDetails } from '../types';
import childPhoto from '../../imagem/Gemini_Generated_Image_38q8gc38q8gc38q8.jpeg';

interface PartyHeaderProps {
  party: PartyDetails;
}

export const PartyHeader: React.FC<PartyHeaderProps> = ({ party }) => {
  return (
    <header className="relative w-full max-w-2xl mx-auto text-center px-4 pt-6 pb-4">
      {/* Decorative Floating Elements (Soft Candy & Baby Pink) */}
      <div className="absolute top-2 left-6 text-[#FFA6CE] opacity-60 pointer-events-none animate-pulse">
        <Sparkles className="w-6 h-6" />
      </div>
      <div className="absolute top-10 right-8 text-[#FF94C2] opacity-60 pointer-events-none">
        <Heart className="w-5 h-5 fill-[#FFB3D1]" />
      </div>
      <div className="absolute -top-2 right-1/4 text-[#FFD1DC] opacity-70 pointer-events-none">
        <Sparkles className="w-4 h-4" />
      </div>

      {/* Main Title Banner */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE4EC] border border-[#F9A8D4] text-[#9D174D] text-xs sm:text-sm font-semibold tracking-wide uppercase mb-3 shadow-xs">
        <Cake className="w-4 h-4 text-[#FF65A3]" />
        <span>Venha Comemorar Conosco!</span>
      </div>

      {/* Title: 'Primeiro aninho da' smaller on top, 'Elizabeth' prominently highlighted */}
      <div className="mb-4">
        <span className="block text-base sm:text-lg md:text-xl font-bold text-[#9D174D] font-['Fredoka',sans-serif] tracking-wider uppercase mb-0.5">
          Primeiro aninho da
        </span>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#831843] font-['Dancing_Script',cursive] tracking-wide leading-tight drop-shadow-2xs">
          Elizabeth
        </h1>
        <img
          src={childPhoto}
          alt="Elizabeth"
          className="mx-auto mt-3 h-64 w-auto max-w-full object-contain opacity-90 drop-shadow-sm"
        />
      </div>

      <p className="text-[#86405F] text-sm sm:text-base max-w-md mx-auto mb-6">
        Você é nosso convidado especial para comemorar esse momento único com muita alegria e carinho! 💕
      </p>

      {/* Event Details Badges (Date, Time, Location) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {/* Date & Time */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/80 border border-[#FCE7F3] shadow-xs backdrop-blur-xs">
          <div className="p-2.5 rounded-xl bg-[#FFE4EC] text-[#DB2777]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-[#9D174D]">Data & Horário</span>
            <p className="text-sm font-semibold text-[#4A2033] mt-0.5">{party.date}</p>
            <p className="text-xs text-[#86405F] flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 inline" /> às {party.time}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/80 border border-[#FCE7F3] shadow-xs backdrop-blur-xs">
          <div className="p-2.5 rounded-xl bg-[#FFE4EC] text-[#DB2777]">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#9D174D]">Local da Festa</span>
            <p className="text-sm font-semibold text-[#4A2033] mt-0.5">{party.locationName}</p>
            <p className="text-xs text-[#86405F] line-clamp-1 mt-0.5">{party.address}</p>
            {party.mapsUrl && (
              <a
                id="btn-open-location"
                href={party.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#FFE4EC] px-3 py-2 text-[11px] font-bold text-[#9D174D] border border-[#FBCFE8] hover:bg-[#FFD6E0] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Ver localização no mapa
              </a>
            )}
          </div>
        </div>
      </div>

      {party.rsvpDeadline && (
        <div className="mt-3 text-xs text-[#9D174D] font-medium">
          Por favor, confirme sua presença até o dia <span className="font-bold underline">{party.rsvpDeadline}</span>
        </div>
      )}
    </header>
  );
};
