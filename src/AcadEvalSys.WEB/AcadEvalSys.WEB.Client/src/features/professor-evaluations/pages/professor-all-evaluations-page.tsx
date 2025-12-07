import { useMemo, useEffect } from "react";
import {
  PageLayout,
  PageContent,
  PageSection,
  PageHeader,
} from "@/shared/components/layout/page-layout";
import { useProfessorAssignments } from "@/features/professor-evaluations/hooks/use-professor-assignments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import ProfessorAssignmentsTable from "@/features/professor-evaluations/components/professor-assignments-table";

export default function ProfessorAllEvaluationsPage() {
  const { data: assignments = [], refetch } = useProfessorAssignments();
  
  // Refetch al montar el componente para asegurar datos actualizados
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Memoizar filtrado de asignaciones
  // Normalizar el status para comparar correctamente (puede venir como string o número)
  const { pending, completed } = useMemo(() => {
    const normalizeStatus = (status: string | number | undefined): string => {
      if (status === undefined) return "Pending";
      if (typeof status === "number") {
        return status === 1 ? "Completed" : "Pending";
      }
      return String(status);
    };
    
    return {
      pending: assignments.filter((a) => normalizeStatus(a.status) !== "Completed"),
      completed: assignments.filter((a) => normalizeStatus(a.status) === "Completed"),
    };
  }, [assignments]);

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          <PageHeader
            title="Mis Asignaciones de Evaluación"
            description="Revise y continúe con sus evaluaciones asignadas"
          />

          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pendientes ({pending.length})</TabsTrigger>
              <TabsTrigger value="completed">Completadas ({completed.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              <ProfessorAssignmentsTable data={pending} />
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <ProfessorAssignmentsTable data={completed} />
            </TabsContent>
          </Tabs>
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}


