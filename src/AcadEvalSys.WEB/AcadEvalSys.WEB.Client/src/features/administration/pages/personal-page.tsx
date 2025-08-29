import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PageLayout,
  PageContent,
} from "@/shared/components/layout/page-layout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { DataSection } from "@/shared/components/ui/data-section";
import { User, UserPlus, Building2, Plus } from "lucide-react";
import { technicalCareerService } from "@/features/careers/services/technical-career-service";
import { professorService } from "@/shared/services/professor-service";
import { identityAdminService } from "../services/identity-admin-service";
import {
  AdminFormDialog,
  AdminFormValues,
} from "../components/admin-form-dialog";
import {
  ProfessorFormDialog,
  ProfessorFormValues,
} from "../components/professor-form-dialog";
import { adminColumns } from "../columns/admin-columns";
import { professorColumns } from "../columns/professor-columns";
import { careerColumns } from "../columns/career-columns";
import { navigate } from "wouter/use-browser-location";
import type { Professor } from "@/shared/types/professor";
import type { TechnicalCareer } from "@/shared/types/technical-career";

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
    queryFn: async () => {
      const result = await professorService.getAll();
      return result.professors;
    },
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
    mutationFn: async (values: AdminFormValues) => {
      if (!selectedAdmin) throw new Error("No admin selected");
      // Implementar actualización de admin
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

  const handleEditCareer = (career: TechnicalCareer) => {
    navigate(`/tecnicaturas/${career.id}/editar`);
  };

  const handleViewCareer = (career: TechnicalCareer) => {
    navigate(`/tecnicaturas/${career.id}/asignaturas`);
  };

  const professors = professorList || [];

  return (
    <PageLayout>
      <PageContent>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Administración
            </h1>
            <p className="text-muted-foreground">
              Gestión de personal, carreras y usuarios del sistema
            </p>
          </div>
        </div>

        <Tabs defaultValue="carreras" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="carreras">Carreras</TabsTrigger>
            <TabsTrigger value="profesores">Profesores</TabsTrigger>
            <TabsTrigger value="administradores">Administradores</TabsTrigger>
          </TabsList>

          <TabsContent value="carreras" className="mt-6">
            <DataSection
              title="Carreras Técnicas"
              description="Crear, editar y eliminar carreras técnicas"
              data={careers}
              columns={careerColumns({
                onEdit: handleEditCareer,
                onDelete: (c) => deleteCareer.mutate(c.id),
                onView: handleViewCareer,
              })}
              isLoading={isLoadingCareers}
              emptyMessage="No se encontraron carreras"
              emptyIcon={<Building2 className="w-8 h-8" />}
              className="mb-6"
              headerActions={
                <Button onClick={() => navigate("/tecnicaturas/nueva")}>
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
                onDelete: (p) => deleteProfessor.mutate(p),
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
        onSubmit={async (values) => {
          if (selectedAdmin) {
            await updateAdmin.mutateAsync(values);
          } else {
            await createAdmin.mutateAsync(values);
          }
          setIsAdminDialogOpen(false);
        }}
      />

      <ProfessorFormDialog
        open={isProfessorDialogOpen}
        onOpenChange={setIsProfessorDialogOpen}
        professor={selectedProfessor}
        onSubmit={async (values) => {
          if (selectedProfessor) {
            await updateProfessor.mutateAsync(values);
          } else {
            await createProfessor.mutateAsync(values);
          }
          setIsProfessorDialogOpen(false);
        }}
      />
    </PageLayout>
  );
}
