import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getEvaluationById } from "../services/evaluation-service";
import { ProfessorEvaluationView } from "../components/professor-evaluations/professor-evaluation-view";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

export default function ProfessorEvaluationPage() {
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
      <div className="space-y-6">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !evaluation) {
    return (
      <div className="space-y-6">
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
              La evaluación "{id}" no existe o no tienes permisos para acceder.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProfessorEvaluationView
      evaluationId={evaluation.id}
      evaluationTitle={evaluation.title}
    />
  );
}
