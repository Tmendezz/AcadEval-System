import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { professorService } from "@/shared/services/professor-service";
import { identityAdminService } from "../services/identity-admin-service";
import { AdminFormValues } from "../components/admin-form-dialog";
import { Professor } from "@/shared/types/professor";

export function useAdminOperations() {
  const queryClient = useQueryClient();
  const [selectedAdmin, setSelectedAdmin] = useState<Professor | null>(null);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  // Query para obtener administradores
  const { data: professorsData, isLoading: isLoadingProfessors } = useQuery({
    queryKey: ["admins"],
    queryFn: () => professorService.getAllAdmins(),
    staleTime: 10_000,
  });

  const admins = professorsData?.admins || [];

  // Mutations para operaciones CRUD de administradores
  const createAdmin = useMutation({
    mutationFn: async (values: AdminFormValues) => {
      const id = await identityAdminService.createAdmin({
        name: values.name,
        email: values.email,
        password: values.password || "",
      });
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const updateAdmin = useMutation({
    mutationFn: async (_values: AdminFormValues) => {
      if (!selectedAdmin) throw new Error("No admin selected");
      return selectedAdmin.id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: async (admin: Professor) => {
      // Implementar eliminación de admin
      return admin.id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  // Handlers para operaciones de administradores
  const handleNewAdminClick = () => {
    setSelectedAdmin(null);
    setIsAdminDialogOpen(true);
  };

  const handleEditAdmin = (admin: Professor) => {
    setSelectedAdmin(admin);
    setIsAdminDialogOpen(true);
  };

  const handleDeleteAdmin = (admin: Professor) => {
    deleteAdmin.mutate(admin);
  };

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
