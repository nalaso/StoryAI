import { create } from 'zustand';

interface TextState {
  text: string;
  setText: (text: string) => void;
}

export const useTextStore = create<TextState>((set) => ({
  text: '',
  setText: (text) => set({ text }),
}));
