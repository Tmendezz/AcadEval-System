import { create } from "zustand";
import { CareerYear } from "@infrastructure/api/types/enums";

interface FilterState {
  searchTerm: string;
  selectedYear: CareerYear | null;
  selectedCareer: string;
  selectedStatus: string;

  setSearchTerm: (term: string) => void;
  setYear: (year: CareerYear | null) => void;
  setCareer: (careerId: string) => void;
  setStatus: (status: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchTerm: "",
  selectedYear: null,
  selectedCareer: "",
  selectedStatus: "",

  setSearchTerm: (term: string) => set({ searchTerm: term }),
  setYear: (year: CareerYear | null) => set({ selectedYear: year }),
  setCareer: (careerId: string) => set({ selectedCareer: careerId }),
  setStatus: (status: string) => set({ selectedStatus: status }),

  clearFilters: () =>
    set({
      searchTerm: "",
      selectedYear: null,
      selectedCareer: "",
      selectedStatus: "",
    }),
}));
