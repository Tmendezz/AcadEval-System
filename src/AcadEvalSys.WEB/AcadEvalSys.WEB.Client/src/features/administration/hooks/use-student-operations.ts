import { useState, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  studentService,
  Student,
  StudentFormValues,
} from "@/features/administration/services/student-service";
import {
  createQueryKeys,
  useOptimisticMutation,
  useStaleQuery,
} from "@/shared/lib/query-utils";
import { toast } from "sonner";

// ============================================
// QUERY KEYS
// ============================================

export const studentKeys = createQueryKeys("students");

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useStudentOperations() {
  const queryClient = useQueryClient();

  // State
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);

  // Query para obtener estudiantes
  const { data: studentsData, isLoading: isLoadingStudents } = useStaleQuery(
    studentKeys.lists(),
    () => studentService.getAll(),
    { staleMinutes: 2 }
  );

  const students = useMemo(() => studentsData?.items || [], [studentsData?.items]);

  // Mutations con useOptimisticMutation
  const createStudent = useOptimisticMutation<string, StudentFormValues>({
    mutationFn: (values) => studentService.create(values),
    messages: {
      success: "Estudiante creado exitosamente",
      error: "Error al crear el estudiante",
    },
    invalidateKeys: [studentKeys.lists()],
  });

  const updateStudent = useMutation({
    mutationFn: async (values: StudentFormValues) => {
      if (!selectedStudent) throw new Error("No student selected");
      return studentService.update(selectedStudent.id, values);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
      toast.success("Estudiante actualizado exitosamente");
    },
    onError: () => {
      toast.error("Error al actualizar el estudiante");
    },
  });

  const deleteStudent = useOptimisticMutation<void, Student>({
    mutationFn: (student) => studentService.delete(student.id),
    messages: {
      success: "Estudiante eliminado exitosamente",
      error: "Error al eliminar el estudiante",
    },
    invalidateKeys: [studentKeys.lists()],
  });

  const changeStudentPassword = useOptimisticMutation<
    void,
    { student: Student; newPassword: string }
  >({
    mutationFn: ({ student, newPassword }) =>
      studentService.changePassword(student.id, newPassword),
    messages: {
      success: "Contraseña actualizada exitosamente",
      error: "Error al cambiar la contraseña",
    },
    invalidateKeys: [studentKeys.lists()],
  });

  // Handlers con useCallback
  const handleNewStudentClick = useCallback(() => {
    setSelectedStudent(null);
    setIsStudentDialogOpen(true);
  }, []);

  const handleEditStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsStudentDialogOpen(true);
  }, []);

  const handleDeleteStudent = useCallback(
    (student: Student) => {
      deleteStudent.mutate(student);
    },
    [deleteStudent]
  );

  const handleChangeStudentPassword = useCallback(
    async (student: Student, newPassword: string) => {
      await changeStudentPassword.mutateAsync({ student, newPassword });
    },
    [changeStudentPassword]
  );

  return {
    // State
    selectedStudent,
    isStudentDialogOpen,
    setIsStudentDialogOpen,
    students,
    isLoadingStudents,

    // Mutations
    createStudent,
    updateStudent,
    deleteStudent,
    changeStudentPassword,

    // Handlers
    handleNewStudentClick,
    handleEditStudent,
    handleDeleteStudent,
    handleChangeStudentPassword,
  };
}

