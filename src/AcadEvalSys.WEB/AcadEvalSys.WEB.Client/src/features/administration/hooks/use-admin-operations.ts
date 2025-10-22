import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { identityAdminService } from "../services/identity-admin-service";
import { AdminFormValues } from "../components/admin-form-dialog";
import { Professor } from "@infrastructure/api/types/professor";

export function useAdminOperations() {
  const queryClient = useQueryClient();
  const [selectedAdmin, setSelectedAdmin] = useState<Professor | null>(null);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);

  // Query para obtener administradores
  const { data: adminsData, isLoading: isLoadingProfessors } = useQuery({
    queryKey: ["admins"],
    queryFn: () => identityAdminService.getAdmins(),
    staleTime: 10_000,
  });

  const admins: Professor[] = (adminsData?.items || []).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

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
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: async (admin: Professor) => {
      await identityAdminService.deleteAdmin(admin.id);
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
