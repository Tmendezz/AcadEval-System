import { navigate } from "wouter/use-browser-location";
import { Button } from "@/shared/components/ui/button";
import { StatCard } from "@/shared/components/ui/stat-card";
import { PlusCircle, FileBarChart, Target, Brain, Code } from "lucide-react";
import { useGetEvaluations, useCompetencies } from "../hooks";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { LoadingState } from "@/shared/components/ui/loading-state";
import { createCompetencyColumns } from "@/features/competencies/components/competency-columns";
import { evaluationColumns } from "../components/evaluation-columns";
import { DataSection } from "@/shared/components/ui/data-section";
import { EvaluationListItem } from "@infrastructure/api/clients/evaluation-service";
import { Competency } from "@infrastructure/api/types/competency";

export default function EvaluationsDashboard() {
  // Queries
  const { data: competencies = [], isLoading: isLoadingCompetencies } =
    useCompetencies();
  const { data: evaluationsData, isLoading: isLoadingEvaluations } =
    useGetEvaluations();
  const evaluations = evaluationsData?.items || [];

  // Estadísticas
  const evaluationStats = [
    {
      key: "totalEvaluations",
      label: "Total Evaluaciones",
      value: evaluations.length,
      icon: <FileBarChart className="h-4 w-4" />,
    },
    {
      key: "evaluationsThisYear",
      label: "Evaluaciones este año",
      value: evaluations.filter((e: EvaluationListItem) => {
        const year = new Date().getFullYear();
        const evaluationYear = new Date(e.startDate).getFullYear();
        return evaluationYear === year;
      }).length,
      icon: <Target className="h-4 w-4" />,
    },
    {
      key: "totalAssignments",
      label: "Total Asignaciones",
      value: evaluations.reduce(
        (sum: number, e: EvaluationListItem) => sum + e.professorsCount,
        0
      ),
      icon: <Brain className="h-4 w-4" />,
    },
  ];

  const competencyStats = [
    {
      key: "totalCompetencies",
      label: "Total Competencias",
      value: competencies.length,
      icon: <Target className="h-4 w-4" />,
    },
    {
      key: "softCompetencies",
      label: "Competencias Blandas",
      value: competencies.filter((c: Competency) => c.type === "Soft").length,
      icon: <Brain className="h-4 w-4" />,
    },
    {
      key: "technicalCompetencies",
      label: "Competencias Técnicas",
      value: competencies.filter((c: Competency) => c.type === "Technical")
        .length,
      icon: <Code className="h-4 w-4" />,
    },
  ];

  const handleNewCompetency = () => {
    navigate("/evaluations/competencies/create");
  };

  const handleNewEvaluation = () => {
    navigate("/evaluations/create");
  };

  const handleCompetencyClick = (competencyId: string) => {
    navigate(`/evaluations/competencies/${competencyId}`);
  };

  const handleEvaluationClick = (evaluationId: string) => {
    navigate(`/evaluations/${evaluationId}`);
  };

  const isLoading = isLoadingCompetencies || isLoadingEvaluations;

  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState message="Cargando dashboard..." />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Dashboard de Evaluaciones"
        description="Vista general del sistema de evaluaciones por competencias"
      >
        <div className="flex gap-3">
          <Button onClick={handleNewCompetency}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nueva Competencia
          </Button>
          <Button onClick={handleNewEvaluation}>
            <FileBarChart className="mr-2 h-4 w-4" />
            Nueva Evaluación
          </Button>
        </div>
      </PageHeader>

      <PageContent>
        {/* Estadísticas de Evaluaciones */}
        <PageSection>
          <h2 className="text-xl font-semibold mb-4">
            Estadísticas de Evaluaciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {evaluationStats.map((stat) => (
              <StatCard
                key={stat.key}
                title={stat.label}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
          </div>
        </PageSection>

        {/* Estadísticas de Competencias */}
        <PageSection>
          <h2 className="text-xl font-semibold mb-4">
            Estadísticas de Competencias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {competencyStats.map((stat) => (
              <StatCard
                key={stat.key}
                title={stat.label}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
          </div>
        </PageSection>

        <DataSection
          title="Competencias Recientes"
          description="Últimas competencias creadas"
          data={competencies.slice(0, 5)}
          columns={createCompetencyColumns({})}
          isLoading={isLoadingCompetencies}
          emptyMessage="No hay competencias recientes"
          emptyIcon={<Target className="w-8 h-8" />}
          onRowClick={handleCompetencyClick}
          className="mb-6"
        />

        {/* Evaluaciones Recientes */}
        <DataSection
          title="Evaluaciones Recientes"
          description="Últimas evaluaciones creadas"
          data={evaluations.slice(0, 5)}
          columns={evaluationColumns}
          isLoading={isLoadingEvaluations}
          emptyMessage="No hay evaluaciones recientes"
          emptyIcon={<FileBarChart className="w-8 h-8" />}
          onRowClick={handleEvaluationClick}
          className="mb-6"
        />
      </PageContent>
    </PageLayout>
  );
}
