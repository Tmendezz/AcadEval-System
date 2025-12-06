import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { CareerYear } from "../models";
import { getSubjectsByCareer } from "../services/subject-service";

interface UseSubjectsByYearOptions {
  includeEnrolledStudents?: boolean;
  enabled?: boolean;
  initialYear?: CareerYear;
}

// Query keys factory
export const subjectsKeys = {
  all: (careerId: string) => ["subjects", careerId] as const,
  lists: (careerId: string) => [...subjectsKeys.all(careerId), "list"] as const,
  list: (careerId: string, filters: Record<string, unknown>) =>
    [...subjectsKeys.lists(careerId), filters] as const,
};

// Constante fuera del componente para evitar recreación
const YEAR_MAP: Record<CareerYear, string> = {
  [CareerYear.First]: "First",
  [CareerYear.Second]: "Second",
  [CareerYear.Third]: "Third",
};

export const useSubjectsByYear = (
  careerId: string,
  options: UseSubjectsByYearOptions = {}
) => {
  const {
    includeEnrolledStudents = false,
    enabled = true,
    initialYear = CareerYear.First,
  } = options;

  const [selectedYear, setSelectedYear] = useState<CareerYear>(initialYear);
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener todas las asignaturas de la carrera sin filtro de año
  const {
    data: allSubjects = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subjects-by-career", careerId, includeEnrolledStudents],
    queryFn: () =>
      getSubjectsByCareer(
        careerId,
        undefined,
        includeEnrolledStudents
      ),
    enabled: enabled && !!careerId,
    staleTime: 3 * 60 * 1000, // 3 minutos
  });

  // Filtrar asignaturas por año seleccionado y término de búsqueda
  const filteredSubjects = useMemo(() => {
    const yearString = YEAR_MAP[selectedYear];
    let filtered = allSubjects.filter((subject) => subject.year === yearString);

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((subject) =>
        subject.name.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [allSubjects, selectedYear, searchTerm]);

  // Acciones memoizadas
  const changeYear = useCallback((year: CareerYear) => {
    setSelectedYear(year);
  }, []);

  const resetYear = useCallback(() => {
    setSelectedYear(CareerYear.First);
  }, []);

  const setSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedYear(CareerYear.First);
    setSearchTerm("");
  }, []);

  return {
    filteredSubjects,
    selectedYear,
    searchTerm,
    isLoading,
    error,

    // Estadísticas
    totalStats: {
      totalSubjects: filteredSubjects.length,
      totalStudents: filteredSubjects.reduce(
        (acc, subject) => acc + (subject.enrolledStudents?.length || 0),
        0
      ),
      totalAssignedProfessors: filteredSubjects.filter(
        (subject) => subject.professorId
      ).length,
    },

    // Acciones
    changeYear,
    resetYear,
    setSearch,
    clearSearch,
    resetFilters,
    refetch,
  };
};
