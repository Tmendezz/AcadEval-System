import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { professorService } from "../services/professor-service";
type Professor = { userId: string; name: string; email: string; phone?: string };
import { ProfessorFormValues } from "../components/professor-form-dialog";
import { toast } from "sonner";

export function useProfessorOperations() {
  const queryClient = useQueryClient();
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );
  const [isProfessorDialogOpen, setIsProfessorDialogOpen] = useState(false);
  const [isAssignmentsModalOpen, setIsAssignmentsModalOpen] = useState(false);
  const [professorAssignments, setProfessorAssignments] = useState<
    Array<{
      id: string;
      name: string;
      careerName: string;
      year: number;
    }>
  >([]);

  // Query para obtener profesores
  const { data: professorList, isLoading: isLoadingProfessorList } = useQuery({
    queryKey: ["professors"],
    queryFn: async () => {
      const result = await professorService.getAll({ pageNumber: 1, pageSize: 50 });
      return result.items;
    },
    staleTime: 10_000,
  });

  const professors = professorList || [];

  // Mutations para operaciones CRUD de profesores
  const createProfessor = useMutation({
    mutationFn: async (values: ProfessorFormValues) => {
      const id = await professorService.create({
        ...values,
        password: values.password || "",
      });
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["professors"] });
      toast.success("Profesor creado exitosamente");
    },
    onError: (error: any) => {
      console.error("Error creating professor:", error);
      toast.error("Error al crear el profesor");
    },
  });

  const updateProfessor = useMutation({
    mutationFn: async (values: ProfessorFormValues) => {
      if (!selectedProfessor) throw new Error("No professor selected");
      const id = await professorService.update(selectedProfessor.userId, values);
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["professors"] });
      toast.success("Profesor actualizado exitosamente");
    },
    onError: (error: any) => {
      console.error("Error updating professor:", error);
      toast.error("Error al actualizar el profesor");
    },
  });

  const deleteProfessor = useMutation({
    mutationFn: async (professor: Professor) => {
      const response = await professorService.delete(professor.userId);
      return { professor, response };
    },
    onSuccess: async (data) => {
      const { professor, response } = data;

      if (response.success) {
        toast.success("Profesor eliminado exitosamente");
        await queryClient.invalidateQueries({ queryKey: ["professors"] });
      } else if (response.hasAssignments) {
        // Mostrar modal con las asignaturas asignadas
        setProfessorAssignments(response.assignedSubjects || []);
        setIsAssignmentsModalOpen(true);
      } else {
        toast.error(response.message || "Error al eliminar el profesor");
      }
    },
    onError: (error) => {
      console.error("Error al eliminar profesor:", error);
      toast.error("Error al eliminar el profesor. Intente nuevamente.");
    },
  });

  // Handlers para operaciones de profesores
  const handleNewProfessorClick = () => {
    setSelectedProfessor(null);
    setIsProfessorDialogOpen(true);
  };

  const handleEditProfessor = (professor: Professor) => {
    setSelectedProfessor(professor);
    setIsProfessorDialogOpen(true);
  };

  const handleDeleteProfessor = (professor: Professor) => {
    deleteProfessor.mutate(professor);
  };

  const handleCloseAssignmentsModal = () => {
    setIsAssignmentsModalOpen(false);
    setProfessorAssignments([]);
  };

  return {
    // State
    selectedProfessor,
    isProfessorDialogOpen,
    setIsProfessorDialogOpen,
    isAssignmentsModalOpen,
    setIsAssignmentsModalOpen,
    professorAssignments,
    professors,
    isLoadingProfessorList,

    // Mutations
    createProfessor,
    updateProfessor,
    deleteProfessor,

    // Handlers
    handleNewProfessorClick,
    handleEditProfessor,
    handleDeleteProfessor,
    handleCloseAssignmentsModal,
  };
}
