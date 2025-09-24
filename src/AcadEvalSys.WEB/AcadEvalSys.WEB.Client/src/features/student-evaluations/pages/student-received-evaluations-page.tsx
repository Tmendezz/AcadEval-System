
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import { Target } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { DataSection } from "@/shared/components/ui/data-section";
import { useStudentReceivedEvaluations } from "../../evaluations/hooks/student-evaluations/use-student-received-evaluations";
import { studentReceivedEvaluationColumns } from "../components/columns/student-received-evaluations-columns";

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
            data={receivedEvaluations}
            columns={studentReceivedEvaluationColumns}
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
