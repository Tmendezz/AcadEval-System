import { create } from "zustand";

type CompetencyLevel = "Inicial" | "Intermedio" | "Avanzado" | "Excelente";

export interface ProfessorEvaluationsState {
  selectedAssignmentId: string | null;
  setSelectedAssignmentId: (id: string | null) => void;

  pendingSaves: Record<string, CompetencyLevel>;
  setPendingSave: (studentId: string, level: CompetencyLevel) => void;
  removePendingSave: (studentId: string) => void;
  clearPendingSaves: () => void;

  lastSavedAt: number | null;
  setLastSavedAt: (ts: number) => void;
}

export const useProfessorEvaluationsStore = create<ProfessorEvaluationsState>((set) => ({
  selectedAssignmentId: null,
  setSelectedAssignmentId: (id) => set({ selectedAssignmentId: id }),

  pendingSaves: {},
  setPendingSave: (studentId, level) =>
    set((state) => ({ pendingSaves: { ...state.pendingSaves, [studentId]: level } })),
  removePendingSave: (studentId) =>
    set((state) => {
      const next = { ...state.pendingSaves };
      delete next[studentId];
      return { pendingSaves: next };
    }),
  clearPendingSaves: () => set({ pendingSaves: {} }),

  lastSavedAt: null,
  setLastSavedAt: (ts) => set({ lastSavedAt: ts }),
}));


