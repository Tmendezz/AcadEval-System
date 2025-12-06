import { create } from "zustand";

interface EvaluationsState {
  isLoading: boolean;
  error: string | null;

  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useEvaluationsStore = create<EvaluationsState>((set) => ({
  isLoading: false,
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
