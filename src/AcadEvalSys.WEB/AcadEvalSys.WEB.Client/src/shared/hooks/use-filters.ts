import { useFilterStore } from "@/shared/stores/filter-store";
import { CareerYear } from "@/shared/types/enums";

export const useFilters = () => {
  const {
    searchTerm,
    selectedYear,
    selectedCareer,
    selectedStatus,
    setSearchTerm,
    setYear,
    setCareer,
    setStatus,
    clearFilters,
    clearSearch,
  } = useFilterStore();

  // Helpers para filtros específicos
  const hasActiveFilters =
    searchTerm || selectedYear || selectedCareer || selectedStatus;

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedYear) count++;
    if (selectedCareer) count++;
    if (selectedStatus) count++;
    return count;
  };

  // Helpers para filtros de año
  const isYearSelected = (year: CareerYear) => selectedYear === year;

  const toggleYear = (year: CareerYear) => {
    setYear(selectedYear === year ? null : year);
  };

  return {
    // Estado
    searchTerm,
    selectedYear,
    selectedCareer,
    selectedStatus,
    hasActiveFilters,
    activeFiltersCount: getActiveFiltersCount(),

    // Acciones
    setSearchTerm,
    setYear,
    setCareer,
    setStatus,
    clearFilters,
    clearSearch,

    // Helpers
    isYearSelected,
    toggleYear,
  };
};
