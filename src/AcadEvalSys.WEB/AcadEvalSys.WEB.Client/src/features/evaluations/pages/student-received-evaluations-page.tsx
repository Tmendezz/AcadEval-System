import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { Target, Eye } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { DataSection } from "@/shared/components/ui/data-section";
import { Button } from "@/shared/components/ui/button";
import { Link } from "wouter";
import { useStudentReceivedEvaluations } from "../hooks/student-evaluations/use-student-received-evaluations";
import { StudentReceivedEvaluation } from "@/shared/services/student-evaluation-service";

export default function StudentReceivedEvaluationsPage() {
  const { data: receivedEvaluations = [], isLoading } =
    useStudentReceivedEvaluations();

  if (isLoading) {
    return (
      <PageLayout>
        <PageContent>
          <PageSection>
            <div className="mb-6">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-4 w-96" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </PageSection>
        </PageContent>
      </PageLayout>
    );
  }

  // Crear columnas para la tabla de evaluaciones de estudiantes
  const studentEvaluationColumns = [
    {
      accessorKey: "evaluationInstanceTitle",
      header: "Evaluación",
      cell: ({ row }: { row: { original: StudentReceivedEvaluation } }) => (
        <div>
          <div className="font-medium">
            {row.original.evaluationInstanceTitle}
          </div>
          <div className="text-sm text-muted-foreground">
            {row.original.evaluationInstanceDescription}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "assessmentDate",
      header: "Fecha",
      cell: ({ row }: { row: { original: StudentReceivedEvaluation } }) => {
        if (row.original.assessmentDate) {
          return new Date(row.original.assessmentDate).toLocaleDateString();
        }
        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }: { row: { original: StudentReceivedEvaluation } }) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/evaluaciones/alumnos/mis-evaluaciones/${row.original.id}`}
          >
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="w-4 h-4" />
              Ver Detalle
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2">
            <Target className="w-4 h-4" />
            Descargar PDF
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Mis Evaluaciones Recibidas
            </h1>
            <p className="text-muted-foreground">
              Revisa las evaluaciones de competencias que has recibido de tus
              profesores
            </p>
          </div>

          {/* Contador de evaluaciones */}
          <div className="mb-6 flex items-center justify-end">
            <div className="text-sm text-muted-foreground">
              {receivedEvaluations?.length || 0} evaluaciones disponibles
            </div>
          </div>

          {/* Tabla de Evaluaciones */}
          <DataSection
            title="Mis Evaluaciones Recibidas"
            description="Revisa las evaluaciones de competencias que has recibido de tus profesores"
            data={receivedEvaluations}
            columns={studentEvaluationColumns}
            isLoading={isLoading}
            emptyMessage="No has recibido evaluaciones aún"
            emptyIcon={<Target className="w-8 h-8" />}
            className="mb-6"
          />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
