import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService, Student, StudentFormValues } from "@/features/administration/services/student-service";
import { toast } from "sonner";
import { AxiosError } from "axios";

export function useStudentOperations() {
  const queryClient = useQueryClient();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);

  // Query para obtener estudiantes
  const { data: studentsData, isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students"],
    queryFn: () => studentService.getAll(),
    staleTime: 10_000,
  });

  const students = studentsData?.items || [];

  // Mutations para operaciones CRUD de estudiantes
  const createStudent = useMutation({
    mutationFn: async (values: StudentFormValues) => {
      const id = await studentService.create(values);
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Estudiante creado exitosamente");
    },
    onError: (error) => {
      console.error("Error creating student:", error);
      const axiosError = error as AxiosError<{ Message?: string; message?: string }>;
      
      // Intentar diferentes formas de obtener el mensaje de error
      let errorMessage = "Error al crear el estudiante";
      
      if (axiosError.response?.data?.Message) {
        errorMessage = axiosError.response.data.Message;
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
      
      toast.error(errorMessage);
    },
  });

  const updateStudent = useMutation({
    mutationFn: async (values: StudentFormValues) => {
      if (!selectedStudent) throw new Error("No student selected");
      const id = await studentService.update(selectedStudent.id, values);
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Estudiante actualizado exitosamente");
    },
    onError: (error) => {
      console.error("Error updating student:", error);
      const axiosError = error as AxiosError<{ Message?: string; message?: string }>;
      
      let errorMessage = "Error al actualizar el estudiante";
      if (axiosError.response?.data?.Message) {
        errorMessage = axiosError.response.data.Message;
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
      
      toast.error(errorMessage);
    },
  });

  const deleteStudent = useMutation({
    mutationFn: async (student: Student) => {
      await studentService.delete(student.id);
      return student.id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Estudiante eliminado exitosamente");
    },
    onError: (error) => {
      console.error("Error deleting student:", error);
      const axiosError = error as AxiosError<{ Message?: string; message?: string }>;
      
      let errorMessage = "Error al eliminar el estudiante";
      if (axiosError.response?.data?.Message) {
        errorMessage = axiosError.response.data.Message;
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }
      
      toast.error(errorMessage);
    },
  });

  const changeStudentPassword = useMutation({
    mutationFn: async ({
      student,
      newPassword,
    }: {
      student: Student;
      newPassword: string;
    }) => {
      await studentService.changePassword(student.id, newPassword);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Contraseña actualizada exitosamente");
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ Message?: string }>;
      const errorMessage = axiosError.response?.data?.Message || "Error al cambiar la contraseña";
      toast.error(errorMessage);
      console.error("Error changing password:", error);
    },
  });

  // Handlers para operaciones de estudiantes
  const handleNewStudentClick = () => {
    setSelectedStudent(null);
    setIsStudentDialogOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsStudentDialogOpen(true);
  };

  const handleDeleteStudent = (student: Student) => {
    deleteStudent.mutate(student);
  };

  const handleChangeStudentPassword = async (
    student: Student,
    newPassword: string
  ) => {
    await changeStudentPassword.mutateAsync({ student, newPassword });
  };

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


