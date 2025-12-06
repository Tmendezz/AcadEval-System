import { useState, useCallback, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { identityAdminService } from "../services/identity-admin-service";
import { AdminFormValues } from "../components/admin-form-dialog";
import { Professor } from "@infrastructure/api/types/professor";
import {
  createQueryKeys,
  useOptimisticMutation,
  useStaleQuery,
} from "@/shared/lib/query-utils";

// ============================================
// QUERY KEYS
// ============================================

export const adminKeys = createQueryKeys("admins");

// ============================================
// HOOK PRINCIPAL
// ============================================

export function useAdminOperations() {
  const queryClient = useQueryClient();

  // State
  const [selectedAdmin, setSelectedAdmin] = useState<Professor | null>(null);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  // Query para obtener administradores
  const { data: adminsData, isLoading: isLoadingProfessors } = useStaleQuery(
    adminKeys.lists(),
    () => identityAdminService.getAdmins(),
    { staleMinutes: 2 }
  );

  const admins = useMemo<Professor[]>(
    () =>
      (adminsData?.items || []).map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
    [adminsData?.items]
  );

  // Mutations
  const createAdmin = useOptimisticMutation<string, AdminFormValues>({
    mutationFn: (values) =>
      identityAdminService.createAdmin({
        name: values.name,
        email: values.email,
        password: values.password || "",
      }),
    messages: {
      success: "Administrador creado exitosamente",
      error: "Error al crear el administrador",
    },
    invalidateKeys: [adminKeys.lists()],
  });

  const updateAdmin = useMutation({
    mutationFn: async (values: AdminFormValues) => {
      if (!selectedAdmin) throw new Error("No admin selected");
      await identityAdminService.updateAdmin({
        id: selectedAdmin.id,
        name: values.name,
        email: values.email,
        password: values.password,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: adminKeys.lists() });
    },
  });

  const deleteAdmin = useOptimisticMutation<void, Professor>({
    mutationFn: (admin) => identityAdminService.deleteAdmin(admin.id),
    messages: {
      success: "Administrador eliminado exitosamente",
      error: "Error al eliminar el administrador",
    },
    invalidateKeys: [adminKeys.lists()],
  });

  // Handlers con useCallback
  const handleNewAdminClick = useCallback(() => {
    setSelectedAdmin(null);
    setIsAdminDialogOpen(true);
  }, []);

  const handleEditAdmin = useCallback((admin: Professor) => {
    setSelectedAdmin(admin);
    setIsAdminDialogOpen(true);
  }, []);

  const handleDeleteAdmin = useCallback(
    (admin: Professor) => {
      deleteAdmin.mutate(admin);
    },
    [deleteAdmin]
  );

  return {
    // State
    selectedAdmin,
    isAdminDialogOpen,
    setIsAdminDialogOpen,
    admins,
    isLoadingProfessors,

    // Mutations
    createAdmin,
    updateAdmin,
    deleteAdmin,

    // Handlers
    handleNewAdminClick,
    handleEditAdmin,
    handleDeleteAdmin,
  };
}
