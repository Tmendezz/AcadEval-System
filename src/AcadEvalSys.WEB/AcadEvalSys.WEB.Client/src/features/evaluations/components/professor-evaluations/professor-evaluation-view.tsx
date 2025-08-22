import { useState } from "react";
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  ChevronLeft,
  Target,
  Users,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { Link } from "wouter";
import { ProfessorEvaluationAssignment } from "../../types/professor-evaluation";
import { ProfessorAssignmentsList } from "./professor-assignments-list";
import { StudentsEvaluationList } from "./students-evaluation-list";

interface ProfessorEvaluationViewProps {
  evaluationId: string;
  evaluationTitle: string;
}

export function ProfessorEvaluationView({
  evaluationId,
  evaluationTitle,
}: ProfessorEvaluationViewProps) {
  const [selectedAssignment, setSelectedAssignment] =
    useState<ProfessorEvaluationAssignment | null>(null);

  const handleAssignmentSelect = (
    assignment: ProfessorEvaluationAssignment
  ) => {
    setSelectedAssignment(assignment);
  };

  const handleBackToAssignments = () => {
    setSelectedAssignment(null);
  };

  const getAssignmentDisplayName = (
    assignment: ProfessorEvaluationAssignment
  ) => {
    return `${assignment.competencyName} - ${assignment.subjectName}`;
  };

  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          {/* Header con navegación */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/evaluaciones">
                <Button variant="ghost" className="gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Volver a Evaluaciones
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-bold text-foreground">
                Evaluación de Competencias
              </h1>
            </div>
          </div>

          {/* Información de la evaluación */}
          <Card className="border-0 bg-muted/20 mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Información de la Evaluación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-foreground">
                  {evaluationTitle}
                </h2>
                <p className="text-muted-foreground">
                  Aquí puedes evaluar las competencias de los estudiantes en las
                  asignaturas que tienes asignadas.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contenido principal */}
          {selectedAssignment ? (
            <StudentsEvaluationList
              assignmentId={selectedAssignment.assignmentId}
              assignmentName={getAssignmentDisplayName(selectedAssignment)}
              onBack={handleBackToAssignments}
            />
          ) : (
            <ProfessorAssignmentsList
              evaluationId={evaluationId}
              onAssignmentSelect={handleAssignmentSelect}
            />
          )}
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
