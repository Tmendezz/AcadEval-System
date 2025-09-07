import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StudentForEvaluation } from "../models";
import { useGetStudentsForAssignment } from "./use-students-for-assignment";
import { useGetProfessorAssignmentById } from "./use-professor-assignment-by-id";

export const useEvaluateStudents = (assignmentId: string) => {
  const [selectedStudent, setSelectedStudent] =
    useState<StudentForEvaluation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Limpiar el assignmentId si tiene sufijos extraños
  const cleanAssignmentId = assignmentId?.split("@")[0] || "";

  const {
    data: assignment,
    isLoading: isLoadingAssignment,
    error: assignmentError,
    refetch: refetchAssignment,
  } = useGetProfessorAssignmentById(cleanAssignmentId);

  const {
    data: students,
    isLoading: isLoadingStudents,
    error: studentsError,
    refetch: refetchStudents,
  } = useGetStudentsForAssignment(cleanAssignmentId);

  // Asegurar que students sea un array
  const studentsArray = Array.isArray(students) ? students : [];

  const evaluatedStudents = studentsArray.filter(
    (student) => student.status === "Evaluated"
  );
  const pendingStudents = studentsArray.filter(
    (student) => student.status === "Pending"
  );

  const handleEvaluateStudent = (student: StudentForEvaluation) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleEvaluationComplete = async () => {
    try {
      // Invalidar y refetch las queries relevantes
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["students-for-assignment", "assignment", assignmentId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["professor-assignment-by-id", "assignment", assignmentId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["all-professor-assignments"],
        }),
      ]);

      toast.success("Evaluación completada. Datos actualizados.");
    } catch (error) {
      console.error("Error al actualizar datos:", error);
      toast.error("Error al actualizar los datos. Intente recargar la página.");
    }
  };

  const handleRetry = () => {
    refetchAssignment();
    refetchStudents();
  };

  return {
    // Data
    assignment,
    students: studentsArray,
    evaluatedStudents,
    pendingStudents,
    selectedStudent,
    isModalOpen,

    // Loading states
    isLoadingAssignment,
    isLoadingStudents,
    isLoading: isLoadingAssignment || isLoadingStudents,

    // Error states
    assignmentError,
    studentsError,
    hasError: !!(assignmentError || studentsError),

    // Actions
    handleEvaluateStudent,
    handleCloseModal,
    handleEvaluationComplete,
    handleRetry,
    setSelectedStudent,
    setIsModalOpen,
  };
};
