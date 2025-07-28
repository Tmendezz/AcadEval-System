import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Subject } from "@/shared/types";
import { CareerYear } from "@/shared/types/enums";
import { subjectService } from "../services/subject-service";

interface UseSubjectsByYearOptions {
  includeEnrolledStudents?: boolean;
  enabled?: boolean;
  initialYear?: CareerYear;
}

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

  // Obtener todas las asignaturas de la carrera
  const {
    data: allSubjects = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["subjects-by-career", careerId, includeEnrolledStudents],
    queryFn: () =>
      subjectService.getSubjectsByCareer(
        careerId,
        selectedYear.toString(),
        includeEnrolledStudents
      ),
    enabled: enabled && !!careerId,
  });

  // Filtrar asignaturas por año seleccionado y término de búsqueda
  const filteredSubjects = useMemo(() => {
    let filtered = allSubjects;

    // Filtrar por año
    if (selectedYear !== CareerYear.First) {
      filtered = filtered.filter(
        (subject) => subject.year === selectedYear.toString()
      );
    }

    return filtered;
  }, [allSubjects, selectedYear]);

  const changeYear = (year: CareerYear) => {
    setSelectedYear(year);
  };

  const resetYear = () => {
    setSelectedYear(CareerYear.First);
  };

  const setSearch = (term: string) => {
    setSearchTerm(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const resetFilters = () => {
    setSelectedYear(CareerYear.First);
    setSearchTerm("");
  };

  return {
    filteredSubjects,
    selectedYear,
    searchTerm,
    isLoading,
    error,

    // Estadísticas
    totalStats: {
      totalSubjects: filteredSubjects.length,
      totalStudents: 0,
      totalAssignedProfessors: 0,
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
