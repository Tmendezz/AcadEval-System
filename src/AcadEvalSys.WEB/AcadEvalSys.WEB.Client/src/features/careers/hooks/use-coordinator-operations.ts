import { coordinatorService } from "../services/coordinator-service";
import {
  createQueryKeys,
  useOptimisticMutation,
  useEntityQuery,
} from "@/shared/lib/query-utils";

// Query keys para coordinadores
export const coordinatorKeys = createQueryKeys("career-coordinator");

/**
 * Hook para obtener el coordinador de una carrera
 */
export function useCareerCoordinator(careerId: string) {
  return useEntityQuery(
    coordinatorKeys.detail(careerId),
    () => coordinatorService.getCareerCoordinator(careerId),
    careerId,
    { staleMinutes: 5 }
  );
}

/**
 * Hook para operaciones de coordinador (asignar/remover)
 */
export function useCoordinatorOperations(careerId: string) {
  const assignCoordinator = useOptimisticMutation({
    mutationFn: (userId: string) =>
      coordinatorService.assignCoordinator(careerId, userId),
    messages: {
      success: "Coordinador asignado exitosamente",
      error: "Error al asignar coordinador",
    },
    invalidateKeys: [
      coordinatorKeys.detail(careerId),
      ["careers"],
    ],
  });

  const removeCoordinator = useOptimisticMutation({
    mutationFn: () => coordinatorService.removeCoordinator(careerId),
    messages: {
      success: "Coordinador removido exitosamente",
      error: "Error al remover coordinador",
    },
    invalidateKeys: [
      coordinatorKeys.detail(careerId),
      ["careers"],
    ],
  });

  return {
    assignCoordinator,
    removeCoordinator,
  };
}
