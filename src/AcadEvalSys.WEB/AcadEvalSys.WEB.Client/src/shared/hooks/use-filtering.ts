import { useMemo, useState, useCallback } from "react";
import { FilterOptions, FilterConfig } from "@/shared/types/ui";

export const useFiltering = <T>({
  data,
  filters,
  filterFn,
}: FilterOptions<T>) => {
  const filteredData = useMemo(() => {
    return data.filter((item) => filterFn(item, filters));
  }, [data, filters, filterFn]);

  return { filteredData };
};

// Hook más avanzado con configuración automática
export const useAdvancedFiltering = <T>(data: T[], config: FilterConfig<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState<string>("createdAtDesc"); // Por defecto, ordenar por fecha de creación (más reciente primero)

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Aplicar búsqueda
    if (searchTerm) {
      result = result.filter((item) =>
        config.searchFields.some((field) => {
          const value = item[field];
          return (
            value &&
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    }

    // Aplicar filtros
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && config.filterFields[key]) {
        result = result.filter((item) => config.filterFields[key](item, value));
      }
    });

    // Aplicar ordenamiento
    if (sortBy && config.sortFields?.[sortBy]) {
      result.sort(config.sortFields[sortBy]);
    }

    return result;
  }, [data, searchTerm, activeFilters, sortBy, config]);

  const updateFilter = useCallback((key: string, value: any) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters({});
    setSearchTerm("");
    setSortBy("createdAtDesc"); // Mantener ordenamiento por fecha de creación como predeterminado
  }, []);

  return {
    filteredData: filteredAndSortedData,
    searchTerm,
    setSearchTerm,
    activeFilters,
    updateFilter,
    clearFilters,
    sortBy,
    setSortBy,
  };
};
