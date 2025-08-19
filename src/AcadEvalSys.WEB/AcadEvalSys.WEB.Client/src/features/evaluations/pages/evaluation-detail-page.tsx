import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getEvaluationById } from "../services/evaluation-service";
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
  const {
    data: evaluation,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["evaluation", id],
    queryFn: () => getEvaluationById(id || ""),
    enabled: !!id,
  });

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

  if (error || !evaluation) {
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
              La evaluación "{id}" no existe.
            </p>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }
  console.log(evaluation);
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
