import { useQuery } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";

import { Plus, UserPlus } from "lucide-react";
import { professorService } from "../services/professor-service";
import { technicalCareerService } from "../services/technical-career-service";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { DataTable } from "@/shared/components/data-table/data-table";
import { adminColumns, careerColumns } from "../columns";

export default function PersonalPage() {
  // Queries
  const { data: professorsData, isLoading: isLoadingProfessors } = useQuery({
    queryKey: ["professors"],
    queryFn: () => professorService.getAll(),
  });

  const { data: careers = [], isLoading: isLoadingCareers } = useQuery({
    queryKey: ["technical-careers"],
    queryFn: () => technicalCareerService.getAll(),
  });

  const professors = professorsData?.professors || [];

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
        {/* Tabla de administradores */}
        <PageSection>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Administradores del Sistema
            </h3>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Administrador
            </Button>
          </div>
          <DataTable columns={adminColumns} data={professors} />
        </PageSection>
        {/* Tabla de carreras */}
        <PageSection>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Gestión de Carreras Técnicas
            </h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Carrera
            </Button>
          </div>
          <DataTable columns={careerColumns} data={careers} />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
