import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { useGetEvaluations, useEvaluationFilters } from "../hooks";
import { EvaluationFilters } from "../components";
import { navigate } from "wouter/use-browser-location";
import { PlusCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { evaluationColumns } from "../columns";
import { DataSection } from "@/shared/components/ui/data-section";

export default function EvaluationsPage() {
  const { data: evaluations = [], isLoading } = useGetEvaluations();

  const {
    filteredData: filteredEvaluations,
    searchTerm,
    setSearchTerm,
    activeFilters,
    updateFilter,
  } = useEvaluationFilters(evaluations);

  const handleNewEvaluation = () => {
    navigate("/evaluaciones/nueva");
  };

  return (
    <PageLayout>
      <PageHeader
        title="Gestión de Evaluaciones"
        description="Administra evaluaciones basadas en competencias"
      >
        <div className="flex gap-3">
          <Button onClick={handleNewEvaluation}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Evaluación
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        <PageSection>
          <EvaluationFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={activeFilters.status || "all"}
            onStatusFilterChange={(value) => updateFilter("status", value)}
            careerFilter={activeFilters.career || "all"}
            onCareerFilterChange={(value) => updateFilter("career", value)}
            className="mb-6"
          />

          <DataSection
            title="Lista de Evaluaciones"
            description="Gestiona las evaluaciones por competencias"
            data={filteredEvaluations}
            columns={evaluationColumns}
            isLoading={isLoading}
            emptyMessage="No se encontraron evaluaciones"
            emptyIcon="FileBarChart"
            className="mb-6"
          />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
