import { PartyDetails, GuestConfirmation } from '../types';

export const DEFAULT_PARTY_DETAILS: PartyDetails = {
  childName: 'Elizabeth',
  age: '1 aninho',
  themeTitle: 'Primeiro aninho da Elizabeth',
  date: 'Sábado, 24 de Outubro de 2026',
  time: '16:00',
  locationName: 'Espaço Doce Encanto',
  address: 'Rua das Flores, 120 - Jardim Primavera',
  mapsUrl: 'https://maps.app.goo.gl/sb6pMVo3LR8c2Duu6',
  whatsappContact: '5511999998888',
  rsvpDeadline: '18 de Outubro',
};

export const INITIAL_SAMPLE_GUESTS: GuestConfirmation[] = [
  {
    id: 'sample-1',
    fullName: 'Mariana Santos',
    attending: true,
    companionsCount: 2,
    companionsNames: 'Carlos (marido) e Sofia (filha)',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'sample-2',
    fullName: 'Tia Beatriz e Tio Lucas',
    attending: true,
    companionsCount: 1,
    companionsNames: 'Lucas',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];
