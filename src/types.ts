export interface GuestConfirmation {
  id: string;
  fullName: string;
  attending: boolean; // true = sim, false = não poderei ir
  companionsCount: number; // quantidade de pessoas que vão acompanhar
  companionsNames?: string;
  message?: string;
  phone?: string;
  createdAt: string;
}

export interface PartyDetails {
  childName: string;
  age: string;
  themeTitle: string;
  date: string;
  time: string;
  locationName: string;
  address: string;
  mapsUrl?: string;
  whatsappContact: string; // for receiving direct RSVPs
  rsvpDeadline?: string;
}
