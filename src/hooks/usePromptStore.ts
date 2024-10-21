import { create } from 'zustand';

interface PromptState {
  text: string;
  pages: string;
  age: string;
  setText: (text: string) => void;
  setPages: (pages: string) => void;
  setAge: (age: string) => void;
}

export const usePromptStore = create<PromptState>((set) => ({
  text: '',
  pages: '3',
  age: "0-3",
  setText: (text) => set({ text }),
  setPages: (pages) => set({ pages }),
  setAge: (age) => set({ age }),
}));
