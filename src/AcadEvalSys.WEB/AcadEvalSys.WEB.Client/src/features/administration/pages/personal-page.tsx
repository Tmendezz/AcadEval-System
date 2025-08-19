import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";

import { Plus, UserPlus, User } from "lucide-react";
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
import { professorColumns } from "../columns/professor-columns";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  AdminFormDialog,
  AdminFormValues,
} from "../components/admin-form-dialog";
import { useState } from "react";
import {
  Professor,
  UpdateProfessorRequest,
  CreateProfessorRequest,
} from "@/shared/types/professor";
import {
  ProfessorFormDialog,
  ProfessorFormValues,
} from "../components/professor-form-dialog";

export default function PersonalPage() {
  const queryClient = useQueryClient();
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Professor | null>(null);
  const [isProfessorDialogOpen, setIsProfessorDialogOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(
    null
  );

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

  const { data: professorList, isLoading: isLoadingProfessorList } = useQuery({
    queryKey: ["professors"],
    queryFn: () => professorService.getAll().then((r) => r.professors),
    staleTime: 10_000,
  });

  const deleteCareer = useMutation({
    mutationFn: async (id: string) => technicalCareerService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["technical-careers"] });
    },
  });

  const admins = professorsData?.admins || [];
  if (!isLoadingProfessors && admins.length === 0) {
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

  const createProfessor = useMutation({
    mutationFn: async (values: ProfessorFormValues) => {
      const request: CreateProfessorRequest = {
        name: values.name,
        email: values.email,
        password: values.password || "",
      };
      return professorService.create(request);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["professors"] });
    },
  });

  const updateProfessor = useMutation({
    mutationFn: async ({
      id,
      values,
    }: {
      id: string;
      values: ProfessorFormValues;
    }) => {
      const request: UpdateProfessorRequest = {
        name: values.name,
        email: values.email,
      };
      return professorService.update(id, request);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["professors"] });
    },
  });

  const deleteProfessor = useMutation({
    mutationFn: async (id: string) => professorService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["professors"] });
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
  const professors = professorList ?? [];

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

      <PageContent>
        <Tabs defaultValue="carreras" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            <TabsTrigger className="cursor-pointer" value="carreras">
              Carreras
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="profesores">
              Profesores
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="administradores">
              Administradores
            </TabsTrigger>
          </TabsList>

          <TabsContent value="carreras" className="mt-6">
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
          </TabsContent>

          <TabsContent value="profesores" className="mt-6">
            <DataSection
              title="Gestión de Profesores"
              description="Crear, editar y eliminar profesores"
              data={professors}
              columns={professorColumns({
                onEdit: (p) => {
                  setSelectedProfessor(p);
                  setIsProfessorDialogOpen(true);
                },
                onDelete: (p) => deleteProfessor.mutate(p.id),
              })}
              isLoading={isLoadingProfessorList}
              emptyMessage="No se encontraron profesores"
              emptyIcon={<User className="w-8 h-8" />}
              className="mb-6"
              headerActions={
                <Button
                  onClick={() => {
                    setSelectedProfessor(null);
                    setIsProfessorDialogOpen(true);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Nuevo Profesor
                </Button>
              }
            />
          </TabsContent>

          <TabsContent value="administradores" className="mt-6">
            <DataSection
              title="Administradores del Sistema"
              description="Gestión de usuarios administradores"
              data={admins}
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
          </TabsContent>
        </Tabs>
      </PageContent>

      <AdminFormDialog
        open={isAdminDialogOpen}
        onOpenChange={setIsAdminDialogOpen}
        administrator={selectedAdmin}
        onSubmit={handleSubmitAdmin}
      />

      <ProfessorFormDialog
        open={isProfessorDialogOpen}
        onOpenChange={setIsProfessorDialogOpen}
        professor={selectedProfessor}
        onSubmit={(values) => {
          if (selectedProfessor?.id) {
            updateProfessor.mutate({ id: selectedProfessor.id, values });
          } else {
            createProfessor.mutate(values);
          }
        }}
      />
    </PageLayout>
  );
}
