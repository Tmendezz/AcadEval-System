import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEvaluationById } from "../services/evaluation-service";
import { useGetCareerYearAssignmentDetails } from "./evaluations/queries/use-get-assignment-details";

interface CareerYearAssignmentDetail {
  assignmentId: string;
  competencyName: string;
  subjectName: string;
  professorName: string;
  status: string;
  totalStudentsCount: number;
  evaluatedStudentsCount: number;
  progressPercentage: number;
}

interface CompetencyGroup {
  competencyName: string;
  assignments: CareerYearAssignmentDetail[];
  totalStudents: number;
  evaluatedStudents: number;
  progressPercentage: number;
}

export function useCareerYearData(evaluationId: string, careerName: string, year: string) {
  // Obtener datos de la evaluación
  const {
    data: evaluation,
    isLoading: isLoadingEvaluation,
    error: evaluationError,
  } = useQuery({
    queryKey: ["evaluation", evaluationId],
    queryFn: () => getEvaluationById(evaluationId || ""),
    enabled: !!evaluationId,
  });

  // Obtener el ID de la carrera a partir de los datos de evaluación
  const careerId = useMemo(() => {
    if (!evaluation || !careerName) return null;

    const careerData = evaluation.assignmentsByCareer.find(
      (career: any) => career.careerName === careerName
    );

    return careerData?.careerId || null;
  }, [evaluation, careerName]);

  // Obtener detalles de asignaciones para el año/carrera
  const { data: careerYearDetails, isLoading: isLoadingDetails } =
    useGetCareerYearAssignmentDetails(
      evaluationId || "",
      careerId || "",
      year || "",
      !!evaluationId && !!careerId && !!year
    );

  // Calcular métricas del año
  const yearMetrics = useMemo(() => {
    if (!careerYearDetails) return { completed: 0, pending: 0, total: 0 };

    const completed = careerYearDetails.filter(
      (a: CareerYearAssignmentDetail) => a.status === "Completed"
    ).length;
    const pending = careerYearDetails.filter(
      (a: CareerYearAssignmentDetail) => a.status === "Pending"
    ).length;
    const total = careerYearDetails.length;

    return { completed, pending, total };
  }, [careerYearDetails]);

  // Agrupar por competencia
  const competencyGroups = useMemo(() => {
    if (!careerYearDetails) return [];

    const groups: { [key: string]: CompetencyGroup } = {};

    careerYearDetails.forEach((assignment: CareerYearAssignmentDetail) => {
      if (!groups[assignment.competencyName]) {
        groups[assignment.competencyName] = {
          competencyName: assignment.competencyName,
          assignments: [],
          totalStudents: 0,
          evaluatedStudents: 0,
          progressPercentage: 0,
        };
      }
      groups[assignment.competencyName].assignments.push(assignment);
      groups[assignment.competencyName].totalStudents +=
        assignment.totalStudentsCount;
      groups[assignment.competencyName].evaluatedStudents +=
        assignment.evaluatedStudentsCount;
    });

    // Calcular progreso para cada grupo
    Object.values(groups).forEach((group) => {
      if (group.totalStudents > 0) {
        group.progressPercentage =
          (group.evaluatedStudents / group.totalStudents) * 100;
      }
    });

    return Object.values(groups);
  }, [careerYearDetails]);

  // Obtener datos de la carrera
  const careerData = useMemo(() => {
    if (!evaluation || !careerName) return null;
    return evaluation.assignmentsByCareer.find(
      (career: any) => career.careerName === careerName
    );
  }, [evaluation, careerName]);

  return {
    evaluation,
    careerData,
    yearMetrics,
    competencyGroups,
    isLoading: isLoadingEvaluation || isLoadingDetails,
    error: evaluationError,
  };
}