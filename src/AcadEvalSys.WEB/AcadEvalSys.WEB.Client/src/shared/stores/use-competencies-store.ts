import { create } from "zustand";
import { Competency } from "@infrastructure/api/types/competency";

interface CompetenciesState {
  // Filtros y búsqueda
  searchTerm: string;
  selectedType: "all" | "Soft" | "Technical";

  // Estado de UI
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  selectedCompetency: Competency | null;

  // Acciones para filtros
  setSearchTerm: (term: string) => void;
  setSelectedType: (type: "all" | "Soft" | "Technical") => void;
  clearFilters: () => void;

  // Acciones para modales
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (competency: Competency) => void;
  closeEditModal: () => void;

  // Acciones para competencia seleccionada
  setSelectedCompetency: (competency: Competency | null) => void;
}

export const useCompetenciesStore = create<CompetenciesState>((set) => ({
  // Estado inicial
  searchTerm: "",
  selectedType: "all",
  isCreateModalOpen: false,
  isEditModalOpen: false,
  selectedCompetency: null,

  // Acciones para filtros
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedType: (type) => set({ selectedType: type }),
  clearFilters: () => set({ searchTerm: "", selectedType: "all" }),

  // Acciones para modales
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
  openEditModal: (competency) =>
    set({
      isEditModalOpen: true,
      selectedCompetency: competency,
    }),
  closeEditModal: () =>
    set({
      isEditModalOpen: false,
      selectedCompetency: null,
    }),

  // Acciones para competencia seleccionada
  setSelectedCompetency: (competency) =>
    set({ selectedCompetency: competency }),
}));
