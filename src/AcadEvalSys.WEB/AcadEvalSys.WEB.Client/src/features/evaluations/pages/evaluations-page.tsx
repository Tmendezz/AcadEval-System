import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { useGetEvaluations, useEvaluationFilters } from "../hooks";
import {
  EvaluationList,
  EvaluationFilters,
  EvaluationStatistics,
} from "../components";
import { navigate } from "wouter/use-browser-location";
import { PlusCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Evaluation } from "../types/types";

export default function EvaluationsPage() {
  const { data: evaluations = [], isLoading, error } = useGetEvaluations();

  // Filtros usando hook global
  const {
    filteredData: filteredEvaluations,
    searchTerm,
    setSearchTerm,
    activeFilters,
    updateFilter,
    clearFilters,
  } = useEvaluationFilters(evaluations);

  // Calcular estadísticas
  const totalEvaluations = evaluations.length;
  const activeEvaluations = evaluations.filter((e: Evaluation) => {
    const now = new Date();
    const from = new Date(e.periodFrom);
    const to = new Date(e.periodTo);
    return now >= from && now <= to;
  }).length;
  const completedEvaluations = evaluations.filter((e: Evaluation) => {
    const now = new Date();
    const to = new Date(e.periodTo);
    return now > to;
  }).length;
  const upcomingEvaluations = evaluations.filter((e: Evaluation) => {
    const now = new Date();
    const from = new Date(e.periodFrom);
    return now < from;
  }).length;

  const handleNewEvaluation = () => {
    navigate("/evaluations/new");
  };

  const handleEvaluationClick = (evaluation: Evaluation) => {
    navigate(`/evaluaciones/${evaluation.id}`);
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
          <EvaluationStatistics
            totalEvaluations={totalEvaluations}
            activeEvaluations={activeEvaluations}
            completedEvaluations={completedEvaluations}
            upcomingEvaluations={upcomingEvaluations}
          />
        </PageSection>

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

          <EvaluationList
            evaluations={filteredEvaluations}
            isLoading={isLoading}
            onEvaluationClick={handleEvaluationClick}
          />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
