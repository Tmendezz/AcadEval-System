import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CareerYear } from "@/shared/types/enums";
import { getSubjectsByCareer } from "@/shared/services/subject-service";
import { Subject } from "@/shared/types/subject";

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
        undefined, // No filtrar por año en el backend
        includeEnrolledStudents
      ),
    enabled: enabled && !!careerId,
  });

  // Filtrar asignaturas por año seleccionado y término de búsqueda
  const filteredSubjects = useMemo(() => {
    let filtered = allSubjects;

    // Filtrar por año seleccionado
    filtered = filtered.filter((subject) => {
      // El tipo Subject tiene year como string ("First", "Second", "Third")
      // Mapeamos CareerYear (1, 2, 3) a string correspondiente
      const yearMap = {
        [CareerYear.First]: "First",
        [CareerYear.Second]: "Second",
        [CareerYear.Third]: "Third",
      };
      return subject.year === yearMap[selectedYear];
    });

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter((subject) =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allSubjects, selectedYear, searchTerm]);

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
