import { useParams } from "wouter";
import { useGetEvaluationById } from "../hooks";
import type { Evaluation } from "@infrastructure/api/types/evaluation";
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import {
  EvaluationHeader,
  EvaluationBasicInfo,
  EvaluationProgress,
  CareerAssignmentsSection,
  FinalizeEvaluationButton,
} from "../components";

export default function EvaluationDetailPage() {
  const { id } = useParams();
  const { data: evaluation, isLoading, error } = useGetEvaluationById(id || "") as {
    data: Evaluation | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  // Mostrar loading mientras se carga
  if (isLoading) {
    return (
      <PageLayout>
        <div className="space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </PageLayout>
    );
  }

  // Mostrar error si hay uno
  if (error) {
    return (
      <PageLayout>
        <Link href="/evaluaciones">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Volver a Evaluaciones
          </Button>
        </Link>
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Error al cargar la evaluación
            </h3>
            <p className="text-sm text-muted-foreground">
              No se pudo cargar la evaluación. Por favor, intenta nuevamente.
            </p>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  // Si no hay evaluación después de cargar, mostrar "no encontrada"
  if (!evaluation) {
    return (
      <PageLayout>
        <Link href="/evaluaciones">
          <Button variant="ghost" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Volver a Evaluaciones
          </Button>
        </Link>
        <Card className="border-destructive/50">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold text-destructive">
              Evaluación no encontrada
            </h3>
            <p className="text-sm text-muted-foreground">
              La evaluación solicitada no existe.
            </p>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  // En este punto, TypeScript sabe que evaluation existe
  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          <EvaluationHeader evaluation={evaluation} />
          <EvaluationBasicInfo evaluation={evaluation} />
          <EvaluationProgress evaluation={evaluation} />

          {/* Botón de finalizar evaluación */}
          <div className="flex justify-end mb-6">
            <FinalizeEvaluationButton
              evaluationId={evaluation.id}
              evaluationTitle={evaluation.title}
              completedAssignments={
                evaluation.completedProfessorAssignmentsCount
              }
              totalAssignments={evaluation.totalProfessorAssignmentsCount}
              isCompleted={evaluation.status === "Completed"}
            />
          </div>

          <CareerAssignmentsSection
            assignmentsByCareer={evaluation.assignmentsByCareer}
            evaluationId={evaluation.id}
          />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
