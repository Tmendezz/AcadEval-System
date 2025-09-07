import { create } from "zustand";

interface StudentEvaluationsState {
  isLoading: boolean;
  error: string | null;
  selectedEvaluation: string | null;

  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSelectedEvaluation: (evaluationId: string | null) => void;
}

export const useStudentEvaluationsStore = create<StudentEvaluationsState>(
  (set) => ({
    isLoading: false,
    error: null,
    selectedEvaluation: null,

    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
    setSelectedEvaluation: (evaluationId) =>
      set({ selectedEvaluation: evaluationId }),
  })
);
