"use client";
import { create } from "zustand";

export type Prefill = Partial<{ service: string; city: string; budget: string }>;

/** Tiny UI store: any button can open the lead modal, optionally pre-filled. */
export const useLead = create<{ open: boolean; prefill: Prefill; show: (p?: Prefill) => void; hide: () => void }>((set) => ({
  open: false, prefill: {},
  show: (p = {}) => set({ open: true, prefill: p }),
  hide: () => set({ open: false }),
}));
