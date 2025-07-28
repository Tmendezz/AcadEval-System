import { Assignment } from "../types/evaluation-form";

export const getYearName = (year: number): string => {
  switch (year) {
    case 1:
      return "Primer Año";
    case 2:
      return "Segundo Año";
    case 3:
      return "Tercer Año";
    default:
      return `Año ${year}`;
  }
};

export const getYearKey = (careerId: string, year: number): string => {
  return `${careerId}-${year}`;
};

export const getAssignmentIndex = (
  assignments: Assignment[],
  careerId: string,
  year: number,
  competencyId: string,
  subjectId: string
): number => {
  return assignments.findIndex(
    (a) =>
      a.careerId === careerId &&
      a.year === year &&
      a.competencyId === competencyId &&
      a.subjectId === subjectId
  );
};

export const getAssignmentsForCareerAndYear = (
  assignments: Assignment[],
  careerId: string,
  year: number
): Assignment[] => {
  return assignments.filter((a) => a.careerId === careerId && a.year === year);
};

export const groupAssignmentsByCareer = (assignments: Assignment[]) => {
  const grouped: { [careerId: string]: { [year: number]: Assignment[] } } = {};

  assignments.forEach((assignment) => {
    if (assignment.careerId && assignment.year) {
      if (!grouped[assignment.careerId]) {
        grouped[assignment.careerId] = {};
      }
      if (!grouped[assignment.careerId][assignment.year]) {
        grouped[assignment.careerId][assignment.year] = [];
      }
      grouped[assignment.careerId][assignment.year].push(assignment);
    }
  });

  return grouped;
};

export const formatAssignmentCount = (count: number): string => {
  return `${count} asignación${count !== 1 ? "es" : ""} configurada${
    count !== 1 ? "s" : ""
  }`;
};

export const formatSubjectCount = (count: number): string => {
  return `${count} asignatura${count !== 1 ? "s" : ""}`;
};
