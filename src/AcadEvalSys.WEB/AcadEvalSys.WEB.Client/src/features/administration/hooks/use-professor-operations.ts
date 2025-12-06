import { useState, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { professorService, ProfessorDto } from "../services/professor-service";
import { ProfessorFormValues } from "../components/professor-form-dialog";
import {
  createQueryKeys,
  useOptimisticMutation,
  useStaleQuery,
} from "@/shared/lib/query-utils";

// ============================================
// TIPOS
// ============================================

type ProfessorAssignment = {
  id: string;
  name: string;
  careerName: string;
  year: number;
};

// ============================================
// QUERY KEYS
// ============================================

export const professorKeys = createQueryKeys("professors");

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useProfessorOperations() {
  const queryClient = useQueryClient();

  // State
  const [selectedProfessor, setSelectedProfessor] = useState<ProfessorDto | null>(null);
  const [isProfessorDialogOpen, setIsProfessorDialogOpen] = useState(false);
  const [isAssignmentsModalOpen, setIsAssignmentsModalOpen] = useState(false);
  const [professorAssignments, setProfessorAssignments] = useState<ProfessorAssignment[]>([]);

  // Query para obtener profesores
  const { data: professorList, isLoading: isLoadingProfessorList } = useStaleQuery(
    professorKeys.lists(),
    async () => {
      const result = await professorService.getAll({ pageNumber: 1, pageSize: 50 });
      return result.items;
    },
    { staleMinutes: 2 }
  );

  const professors = useMemo(() => professorList || [], [professorList]);

  // Mutations
  const createProfessor = useOptimisticMutation<string, ProfessorFormValues>({
    mutationFn: (values) =>
      professorService.create({
        ...values,
        password: values.password || "",
      }),
    messages: {
      success: "Profesor creado exitosamente",
      error: "Error al crear el profesor",
    },
    invalidateKeys: [professorKeys.lists()],
  });

  const updateProfessor = useMutation({
    mutationFn: async (values: ProfessorFormValues) => {
      if (!selectedProfessor) throw new Error("No professor selected");

      await professorService.update(selectedProfessor.userId, {
        name: values.name,
        email: values.email,
        phone: values.phone,
      });

      if (values.password?.trim()) {
        await professorService.changePassword(selectedProfessor.userId, values.password);
      }

      return selectedProfessor.userId;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: professorKeys.lists() });
      toast.success("Profesor actualizado exitosamente");
    },
    onError: () => {
      toast.error("Error al actualizar el profesor");
    },
  });

  const deleteProfessor = useMutation({
    mutationFn: async (professor: ProfessorDto) => {
      const response = await professorService.delete(professor.userId);
      return { professor, response };
    },
    onSuccess: async ({ response }) => {
      if (response.success) {
        toast.success("Profesor eliminado exitosamente");
        await queryClient.invalidateQueries({ queryKey: professorKeys.lists() });
      } else if (response.hasAssignments) {
        setProfessorAssignments(response.assignedSubjects || []);
        setIsAssignmentsModalOpen(true);
      } else {
        toast.error(response.message || "Error al eliminar el profesor");
      }
    },
    onError: () => {
      toast.error("Error al eliminar el profesor. Intente nuevamente.");
    },
  });

  // Handlers con useCallback para estabilidad referencial
  const handleNewProfessorClick = useCallback(() => {
    setSelectedProfessor(null);
    setIsProfessorDialogOpen(true);
  }, []);

  const handleEditProfessor = useCallback((professor: ProfessorDto) => {
    setSelectedProfessor(professor);
    setIsProfessorDialogOpen(true);
  }, []);

  const handleDeleteProfessor = useCallback(
    (professor: ProfessorDto) => {
      deleteProfessor.mutate(professor);
    },
    [deleteProfessor]
  );

  const handleCloseAssignmentsModal = useCallback(() => {
    setIsAssignmentsModalOpen(false);
    setProfessorAssignments([]);
  }, []);

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
