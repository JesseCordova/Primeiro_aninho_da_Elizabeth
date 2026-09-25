import React, { useState, useEffect } from 'react';
import { PartyHeader } from './components/PartyHeader';
import { RsvpForm } from './components/RsvpForm';
import { SuccessState } from './components/SuccessState';
import { HostDrawer } from './components/HostDrawer';
import { PasswordModal } from './components/PasswordModal';
import { GuestConfirmation, PartyDetails } from './types';
import { DEFAULT_PARTY_DETAILS, INITIAL_SAMPLE_GUESTS } from './data/defaultParty';
import { Lock, Unlock } from 'lucide-react';
import { firebaseAuth, firestore } from './firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  writeBatch,
} from 'firebase/firestore';

const STORAGE_KEY_PARTY = 'child_party_details_v2';
const STORAGE_KEY_GUESTS = 'child_party_guests_v1';

export default function App() {
  const [party, setParty] = useState<PartyDetails>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PARTY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.themeTitle && parsed.themeTitle !== 'Um Dia Mágico e Doce') {
          return { ...DEFAULT_PARTY_DETAILS, ...parsed };
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_PARTY_DETAILS;
  });

  const [guests, setGuests] = useState<GuestConfirmation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GUESTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SAMPLE_GUESTS;
  });

  const [currentConfirmation, setCurrentConfirmation] = useState<GuestConfirmation | null>(null);
  const [isHostOpen, setIsHostOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState(false);
  const [isGuestsLoaded, setIsGuestsLoaded] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PARTY, JSON.stringify(party));
    } catch {
      // ignore
    }
  }, [party]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setIsFirebaseAuthenticated(Boolean(user));
    });

    signInAnonymously(firebaseAuth).catch(() => {
      setIsFirebaseAuthenticated(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isFirebaseAuthenticated) return undefined;

    const partyReference = doc(firestore, 'settings', 'party');
    const unsubscribeParty = onSnapshot(partyReference, (snapshot) => {
      if (snapshot.exists()) {
        const remoteParty = snapshot.data() as PartyDetails;
        setParty({ ...DEFAULT_PARTY_DETAILS, ...remoteParty });
        return;
      }

      setDoc(partyReference, party).catch(() => {
        // Keep the local configuration if the initial migration fails.
      });
    });

    const unsubscribe = onSnapshot(
      collection(firestore, 'guests'),
      (snapshot) => {
        const remoteGuests = snapshot.docs
          .map((guestDocument) => guestDocument.data() as GuestConfirmation)
          .sort((first, second) => second.createdAt.localeCompare(first.createdAt));

        setGuests(remoteGuests);
        setIsGuestsLoaded(true);
        localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(remoteGuests));
      },
      () => {
        setIsGuestsLoaded(true);
      }
    );

    return () => {
      unsubscribeParty();
      unsubscribe();
    };
  }, [isFirebaseAuthenticated]);

  useEffect(() => {
    if (!isGuestsLoaded) return;

    try {
      localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(guests));
    } catch {
      // ignore
    }
  }, [guests, isGuestsLoaded]);

  const handleAddGuest = async (newGuest: GuestConfirmation) => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Firebase authentication is not ready.');
    }

    await setDoc(doc(firestore, 'guests', newGuest.id), newGuest);
    setGuests((prev) => [newGuest, ...prev]);
    setCurrentConfirmation(newGuest);
  };

  const handleDeleteGuest = async (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));

    try {
      await deleteDoc(doc(firestore, 'guests', id));
    } catch {
      // The realtime listener will restore the remote record if deletion fails.
    }
  };

  const handleClearAllGuests = async () => {
    if (window.confirm('Tem certeza que deseja limpar toda a lista de convidados?')) {
      setGuests([]);

      try {
        const snapshot = await getDocs(collection(firestore, 'guests'));
        const batch = writeBatch(firestore);
        snapshot.docs.forEach((guestDocument) => batch.delete(guestDocument.ref));
        await batch.commit();
      } catch {
        // The realtime listener will restore the remote records if clearing fails.
      }
    }
  };

  const handleSaveParty = async (updatedParty: PartyDetails) => {
    if (!firebaseAuth.currentUser) {
      throw new Error('Firebase authentication is not ready.');
    }

    await setDoc(doc(firestore, 'settings', 'party'), updatedParty);
    setParty(updatedParty);
  };

  const handleOpenHost = () => {
    if (isAuthenticated) {
      setIsHostOpen(true);
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
    setIsPasswordModalOpen(false);
    setIsHostOpen(true);
  };

  const handleLockHost = () => {
    setIsAuthenticated(false);
    setIsHostOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF0F5] via-[#FFF5F8] to-[#FFEBF3] text-[#5C3A48] flex flex-col justify-between selection:bg-[#FBCFE8] selection:text-[#9D174D]">
      {/* Decorative ambient elements (Rosa Candy, Rosa Claro, Rosa Bebê) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft candy pink glow top-right */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#FFA6CE]/20 blur-3xl" />
        {/* Soft baby pink glow bottom-left */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#FFD1DC]/35 blur-3xl" />
        {/* Central candy dot accent */}
        <div className="absolute top-1/3 left-10 w-24 h-24 rounded-full bg-[#FCE7F3]/50 blur-xl" />
        <div className="absolute top-2/3 right-10 w-32 h-32 rounded-full bg-[#FFE4EC]/40 blur-2xl" />
      </div>

      {/* Top Bar - Only a Padlock Button as requested */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 pt-4 flex items-center justify-end">
        <button
          id="btn-open-host-panel"
          type="button"
          onClick={handleOpenHost}
          className="p-2.5 rounded-full bg-white/90 hover:bg-[#FFE4EC] border border-[#FBCFE8] text-[#831843] shadow-2xs hover:shadow-xs transition-all active:scale-95"
          title={isAuthenticated ? 'Área do anfitrião desbloqueada' : 'Acesso do anfitrião (protegido por senha)'}
          aria-label="Acesso do anfitrião"
        >
          {isAuthenticated ? (
            <Unlock className="w-4 h-4 text-emerald-600" />
          ) : (
            <Lock className="w-4 h-4 text-[#DB2777]" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 container mx-auto px-4 py-4 flex-1 flex flex-col justify-center">
        {/* Party Header Banner */}
        <PartyHeader party={party} />

        {/* Dynamic Form or Success Card */}
        <div className="mt-4 mb-8">
          {currentConfirmation ? (
            <SuccessState
              confirmation={currentConfirmation}
              party={party}
              onReset={() => setCurrentConfirmation(null)}
            />
          ) : (
            <RsvpForm
              party={party}
              onSuccess={handleAddGuest}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-4 px-4 border-t border-[#FCE7F3] bg-white/40 backdrop-blur-2xs">
        <p className="text-[11px] text-[#A06C82] tracking-wide">
          Desenvolvido por JBTec
        </p>
      </footer>

      {/* Password Modal to guard guest list */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />

      {/* Host Drawer Modal (Guests & Party Customization) */}
      <HostDrawer
        isOpen={isHostOpen}
        onClose={() => setIsHostOpen(false)}
        onLock={handleLockHost}
        guests={guests}
        party={party}
        onSaveParty={handleSaveParty}
        onDeleteGuest={handleDeleteGuest}
        onClearAll={handleClearAllGuests}
      />
    </div>
  );
}
