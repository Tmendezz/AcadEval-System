import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { coordinatorService, CoordinatorDto } from "../services/coordinator-service";
import { toast } from "sonner";

export function useCareerCoordinator(careerId: string) {
  return useQuery({
    queryKey: ["career-coordinator", careerId],
    queryFn: () => coordinatorService.getCareerCoordinator(careerId),
    enabled: !!careerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCoordinatorOperations(careerId: string) {
  const queryClient = useQueryClient();

  const assignCoordinator = useMutation({
    mutationFn: async (userId: string) => {
      await coordinatorService.assignCoordinator(careerId, userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-coordinator", careerId] });
      queryClient.invalidateQueries({ queryKey: ["careers"] });
      toast.success("Coordinador asignado exitosamente");
    },
    onError: (error: any) => {
      console.error("Error assigning coordinator:", error);
      toast.error("Error al asignar coordinador");
    },
  });

  const removeCoordinator = useMutation({
    mutationFn: async () => {
      await coordinatorService.removeCoordinator(careerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["career-coordinator", careerId] });
      queryClient.invalidateQueries({ queryKey: ["careers"] });
      toast.success("Coordinador removido exitosamente");
    },
    onError: (error: any) => {
      console.error("Error removing coordinator:", error);
      toast.error("Error al remover coordinador");
    },
  });

  return {
    assignCoordinator,
    removeCoordinator,
  };
}
