import { create } from "zustand";

interface ContactStore { open: boolean; show: () => void; hide: () => void }
export const useInteriorContact = create<ContactStore>((set) => ({
  open: false,
  show: () => set({ open: true }),
  hide: () => set({ open: false }),
}));

/** True once the intro (preloader) has finished, so the hero can play its entrance. */
interface ReadyStore { ready: boolean; setReady: (v: boolean) => void }
export const useInteriorReady = create<ReadyStore>((set) => ({
  ready: false,
  setReady: (ready) => set({ ready }),
}));

const interiorStore = { useInteriorContact, useInteriorReady };
export default interiorStore;

