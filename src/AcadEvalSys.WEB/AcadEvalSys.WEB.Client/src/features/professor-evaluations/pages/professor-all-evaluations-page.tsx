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
  const { data: assignments = [], isLoading } = useProfessorAssignments();

  const pending = assignments.filter((a) => a.status !== "Completed");
  const completed = assignments.filter((a) => a.status === "Completed");

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


