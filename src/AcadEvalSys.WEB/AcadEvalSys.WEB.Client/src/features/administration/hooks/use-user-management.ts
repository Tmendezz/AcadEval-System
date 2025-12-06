/**
 * Hook genérico para operaciones de gestión de usuarios
 * Proporciona funcionalidad reutilizable para cambio de contraseñas y generación de contraseñas temporales
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userManagementService } from "../services/user-management-service";
import { getErrorMessage } from "@/shared/utils/error-handler";

export interface UseUserManagementOptions {
  /**
   * Query keys a invalidar después de operaciones exitosas
   * Ejemplo: ["students"], ["professors"], etc.
   */
  invalidateQueries?: string[][];
  
  /**
   * Mensaje de éxito personalizado para cambio de contraseña
   */
  changePasswordSuccessMessage?: string;
  
  /**
   * Mensaje de éxito personalizado para generación de contraseña temporal
   */
  generatePasswordSuccessMessage?: string;
}

/**
 * Hook para gestión de usuarios
 * Proporciona mutaciones y handlers para operaciones comunes
 */
export function useUserManagement(options: UseUserManagementOptions = {}) {
  const queryClient = useQueryClient();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);

  const changePasswordMutation = useMutation({
    mutationFn: async ({ userId, newPassword }: { userId: string; newPassword: string }) => {
      return userManagementService.changePassword(userId, newPassword);
    },
    onSuccess: async () => {
      // Invalidar queries especificadas
      if (options.invalidateQueries) {
        for (const queryKey of options.invalidateQueries) {
          await queryClient.invalidateQueries({ queryKey });
        }
      }
      
      const message = options.changePasswordSuccessMessage || "Contraseña actualizada exitosamente";
      toast.success(message);
      setIsChangingPassword(false);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  const generateTemporaryPasswordMutation = useMutation({
    mutationFn: async (userId: string) => {
      return userManagementService.generateTemporaryPassword(userId);
    },
    onSuccess: (data) => {
      const message = options.generatePasswordSuccessMessage || 
        `Contraseña temporal generada: ${data.temporaryPassword}`;
      toast.success(message, { duration: 10000 }); // 10 segundos para que pueda copiar
      setIsGeneratingPassword(false);
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  /**
   * Cambia la contraseña de un usuario
   */
  const handleChangePassword = async (userId: string, newPassword: string) => {
    if (!newPassword.trim()) {
      toast.error("Debe ingresar una nueva contraseña");
      return;
    }

    await changePasswordMutation.mutateAsync({ userId, newPassword });
  };

  /**
   * Genera una contraseña temporal para un usuario
   */
  const handleGenerateTemporaryPassword = async (userId: string) => {
    await generateTemporaryPasswordMutation.mutateAsync(userId);
  };

  return {
    // Estado
    isChangingPassword,
    setIsChangingPassword,
    isGeneratingPassword,
    setIsGeneratingPassword,
    
    // Mutaciones
    changePasswordMutation,
    generateTemporaryPasswordMutation,
    
    // Handlers
    handleChangePassword,
    handleGenerateTemporaryPassword,
    
    // Estados de carga
    isLoading: changePasswordMutation.isPending || generateTemporaryPasswordMutation.isPending,
  };
}

