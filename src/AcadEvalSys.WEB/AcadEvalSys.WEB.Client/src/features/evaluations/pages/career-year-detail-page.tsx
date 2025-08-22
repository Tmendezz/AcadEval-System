import { useParams } from "wouter";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import {
  PageHeader,
  YearSummaryCard,
  CompetencyTabs,
} from "../components/career-year-detail";
import { useCareerYearData } from "../hooks/use-career-year-data";

export default function CareerYearDetailPage() {
  const { evaluationId, careerId, year } = useParams();

  const {
    evaluation,
    careerData,
    yearMetrics,
    competencyGroups,
    isLoading,
    error,
  } = useCareerYearData(evaluationId || "", careerId || "", year || "");

  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <PageSection>
            <div className="space-y-6">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    );
  }

  if (error || !evaluation) {
    return (
      <PageLayout>
        <PageContent>
          <PageSection>
            <div className="text-center py-8">
              <p className="text-red-600">
                Error al cargar la evaluación. Por favor, intenta nuevamente.
              </p>
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    );
  }

  if (!careerData) {
    return (
      <PageLayout>
        <PageContent>
          <PageSection>
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No se encontró información para la carrera especificada.
              </p>
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          <PageHeader
            evaluationTitle={evaluation.title}
            careerName={careerData.careerName}
            year={year || ""}
            evaluationId={evaluation.id}
          />

          <YearSummaryCard
            careerName={careerData.careerName}
            year={year || ""}
            metrics={yearMetrics}
          />

          <CompetencyTabs competencyGroups={competencyGroups} />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
