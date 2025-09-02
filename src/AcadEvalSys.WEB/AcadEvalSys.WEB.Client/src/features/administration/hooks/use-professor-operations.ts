import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { professorService } from "@/shared/services/professor-service";
import { Professor } from "@/shared/types/professor";
import { ProfessorFormValues } from "../components/professor-form-dialog";

export function useProfessorOperations() {
  const queryClient = useQueryClient();
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );
  const [isProfessorDialogOpen, setIsProfessorDialogOpen] = useState(false);

  // Query para obtener profesores
  const { data: professorList, isLoading: isLoadingProfessorList } = useQuery({
    queryKey: ["professors"],
    queryFn: async () => {
      const result = await professorService.getAll();
      return result.professors;
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
    },
  });

  const updateProfessor = useMutation({
    mutationFn: async (values: ProfessorFormValues) => {
      if (!selectedProfessor) throw new Error("No professor selected");
      const id = await professorService.update(selectedProfessor.id, values);
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["professors"] });
    },
  });

  const deleteProfessor = useMutation({
    mutationFn: async (professor: Professor) => {
      await professorService.delete(professor.id);
      return professor.id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["professors"] });
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

  return {
    // State
    selectedProfessor,
    isProfessorDialogOpen,
    setIsProfessorDialogOpen,
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
  };
}
