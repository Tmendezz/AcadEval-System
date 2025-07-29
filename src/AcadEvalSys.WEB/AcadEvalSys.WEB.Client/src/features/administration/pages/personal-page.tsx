import { useQuery } from "@tanstack/react-query";
import { Button } from "@/shared/components/ui/button";

import { Plus, UserPlus } from "lucide-react";
import { professorService } from "../services/professor-service";
import { technicalCareerService } from "../services/technical-career-service";
import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { DataSection } from "@/shared/components/ui/data-section";
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
        <DataSection
          title="Administradores del Sistema"
          description="Gestión de usuarios administradores"
          data={professors}
          columns={adminColumns}
          isLoading={isLoadingProfessors}
          emptyMessage="No se encontraron administradores"
          emptyIcon={<UserPlus className="w-8 h-8" />}
          className="mb-6"
        >
          <div className="flex justify-end mt-4">
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Nuevo Administrador
            </Button>
          </div>
        </DataSection>

        <DataSection
          title="Gestión de Carreras Técnicas"
          description="Administración de carreras técnicas del instituto"
          data={careers}
          columns={careerColumns}
          isLoading={isLoadingCareers}
          emptyMessage="No se encontraron carreras técnicas"
          emptyIcon={<Plus className="w-8 h-8" />}
          className="mb-6"
        />
      </PageContent>
    </PageLayout>
  );
}
