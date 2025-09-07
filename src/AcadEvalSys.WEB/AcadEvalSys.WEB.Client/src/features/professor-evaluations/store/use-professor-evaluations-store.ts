import { create } from "zustand";

interface ProfessorEvaluationsState {
  isLoading: boolean;
  error: string | null;
  selectedAssignment: string | null;
  selectedStudent: string | null;
  currentEvaluation: { id: string; competencyLevel: string; comments?: string } | null;

  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setSelectedAssignment: (assignmentId: string | null) => void;
  setSelectedStudent: (studentId: string | null) => void;
  setCurrentEvaluation: (evaluation: { id: string; competencyLevel: string; comments?: string } | null) => void;
  resetEvaluation: () => void;
}

export const useProfessorEvaluationsStore = create<ProfessorEvaluationsState>(
  (set) => ({
    isLoading: false,
    error: null,
    selectedAssignment: null,
    selectedStudent: null,
    currentEvaluation: null,

    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
    setSelectedAssignment: (assignmentId) =>
      set({ selectedAssignment: assignmentId }),
    setSelectedStudent: (studentId) => set({ selectedStudent: studentId }),
    setCurrentEvaluation: (evaluation) =>
      set({ currentEvaluation: evaluation }),
    resetEvaluation: () =>
      set({
        selectedAssignment: null,
        selectedStudent: null,
        currentEvaluation: null,
      }),
  })
);
