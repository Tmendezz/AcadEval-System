import { useState } from "react";
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";

import { Clock, CheckCircle } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { DataSection } from "@/shared/components/ui/data-section";
import { professorEvaluationColumns } from "../components";
import { useGetAllProfessorAssignments } from "../hooks";
import { ProfessorAssignment } from "../models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";

export default function ProfessorAllEvaluationsPage() {
  const { data: assignments, isLoading } = useGetAllProfessorAssignments();
  const [tab, setTab] = useState<"pending" | "completed">("pending");

  const pendingAssignments =
    assignments?.filter((a: ProfessorAssignment) => a.status === "Pending") || [];
  const completedAssignments =
    assignments?.filter((a: ProfessorAssignment) => a.status === "Completed") || [];

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

  const totalAssignments = assignments?.length || 0;

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Mis Evaluaciones de Competencias
            </h1>
            <p className="text-muted-foreground">
              Gestiona todas tus evaluaciones de competencias asignadas. Usa los
              filtros para ver evaluaciones pendientes o completadas.
            </p>
          </div>

          {/* Tabs Pendientes / Completadas */}
          <div className="mb-6">
            <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="pending">
                    Pendientes
                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-2 text-xs text-muted-foreground">
                      {pendingAssignments.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Completadas
                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-2 text-xs text-muted-foreground">
                      {completedAssignments.length}
                    </span>
                  </TabsTrigger>
                </TabsList>
                <div className="text-sm text-muted-foreground">
                  {pendingAssignments.length + completedAssignments.length} de {totalAssignments} evaluaciones
                </div>
              </div>

              <TabsContent value="pending">
                <DataSection
                  title="Evaluaciones Pendientes"
                  description="Evaluaciones de competencias que requieren tu atención"
                  data={pendingAssignments}
                  columns={professorEvaluationColumns}
                  isLoading={isLoading}
                  emptyMessage="No tienes evaluaciones pendientes"
                  emptyIcon={<Clock className="w-8 h-8" />}
                  className="mb-6"
                />
              </TabsContent>

              <TabsContent value="completed">
                <DataSection
                  title="Evaluaciones Completadas"
                  description="Evaluaciones de competencias que ya has completado"
                  data={completedAssignments}
                  columns={professorEvaluationColumns}
                  isLoading={isLoading}
                  emptyMessage="No has completado ninguna evaluación aún"
                  emptyIcon={<CheckCircle className="w-8 h-8" />}
                  className="mb-6"
                />
              </TabsContent>
            </Tabs>
          </div>
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
