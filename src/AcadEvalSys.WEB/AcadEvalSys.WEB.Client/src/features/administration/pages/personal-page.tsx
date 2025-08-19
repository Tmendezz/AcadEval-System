import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";

import { Plus, UserPlus } from "lucide-react";
import { professorService } from "@/shared/services/professor-service";
import { identityAdminService } from "../services/identity-admin-service";
import { technicalCareerService } from "../services/technical-career-service";

import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { navigate } from "wouter/use-browser-location";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { DataSection } from "@/shared/components/ui/data-section";
import { adminColumns, careerColumns } from "../columns";
// Modal de carreras eliminado; se navega a páginas dedicadas
import {
  AdminFormDialog,
  AdminFormValues,
} from "../components/admin-form-dialog";
import { useState } from "react";
import { Professor, UpdateProfessorRequest } from "@/shared/types/professor";

export default function PersonalPage() {
  const queryClient = useQueryClient();
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Professor | null>(null);

  // Queries
  const { data: professorsData, isLoading: isLoadingProfessors } = useQuery({
    queryKey: ["admins"],
    queryFn: () => professorService.getAllAdmins(),
    staleTime: 10_000,
  });

  const { data: careers = [], isLoading: isLoadingCareers } = useQuery({
    queryKey: ["technical-careers"],
    queryFn: () => technicalCareerService.getAll(),
  });

  // Sin modal de carreras

  // Eliminadas mutaciones de modal

  const deleteCareer = useMutation({
    mutationFn: async (id: string) => technicalCareerService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["technical-careers"] });
    },
  });

  const professors = professorsData?.admins || [];
  if (!isLoadingProfessors && professors.length === 0) {
    // Log de depuración para detectar por qué no hay admins
    console.log("[AdminList] Lista de administradores vacía", {
      userInfo: "Se espera que el usuario actual sea Admin",
    });
  }

  // Mutations
  const createAdmin = useMutation({
    mutationFn: async (values: AdminFormValues) => {
      const id = await identityAdminService.createAdmin({
        name: values.name,
        email: values.email,
        password: values.password || "",
        phone: values.phone,
      });
      return id;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const updateAdmin = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: AdminFormValues;
    }) => {
      const request: UpdateProfessorRequest = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      return professorService.update(id, request);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: async (userEmail: string) => {
      await identityAdminService.removeAdminRole(userEmail);
      await identityAdminService.deactivateUser(userEmail);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  const handleNewAdminClick = () => {
    setSelectedAdmin(null);
    setIsAdminDialogOpen(true);
  };

  const handleEditAdmin = (admin: Professor) => {
    setSelectedAdmin(admin);
    setIsAdminDialogOpen(true);
  };

  const handleDeleteAdmin = (admin: Professor) => {
    if (!admin?.email) return;
    deleteAdmin.mutate(admin.email);
  };

  const handleSubmitAdmin = (values: AdminFormValues) => {
    if (selectedAdmin?.id) {
      updateAdmin.mutate({ id: selectedAdmin.id, values });
    } else {
      createAdmin.mutate(values);
    }
  };

  const isLoading = isLoadingProfessors || isLoadingCareers;

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState message="Cargando información..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Gestión de Administradores y Carreras"
        description="Administra usuarios administradores y carreras técnicas"
      />

      <PageContent className="space-y-14">
        <DataSection
          title="Administradores del Sistema"
          description="Gestión de usuarios administradores"
          data={professors}
          columns={adminColumns({
            onEdit: handleEditAdmin,
            onDelete: handleDeleteAdmin,
          })}
          isLoading={isLoadingProfessors}
          emptyMessage="No se encontraron administradores"
          emptyIcon={<UserPlus className="w-8 h-8" />}
          className="mb-6"
          headerActions={
            <Button onClick={handleNewAdminClick}>
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Administrador
            </Button>
          }
        />

        <DataSection
          title="Gestión de Carreras Técnicas"
          description="Administración de carreras técnicas del instituto"
          data={careers}
          columns={careerColumns({
            onEdit: (c) => navigate(`/tecnicaturas/${c.id}/editar`),
            onDelete: (c) => deleteCareer.mutate(c.id),
            onView: (c) => navigate(`/tecnicaturas/${c.id}/asignaturas`),
          })}
          isLoading={isLoadingCareers}
          emptyMessage="No se encontraron carreras técnicas"
          emptyIcon={<Plus className="w-8 h-8" />}
          className="mb-6"
          headerActions={
            <Button onClick={() => navigate(`/tecnicaturas/nueva`)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva carrera
            </Button>
          }
        />
      </PageContent>

      <AdminFormDialog
        open={isAdminDialogOpen}
        onOpenChange={setIsAdminDialogOpen}
        administrator={selectedAdmin}
        onSubmit={handleSubmitAdmin}
      />
    </PageLayout>
  );
}
