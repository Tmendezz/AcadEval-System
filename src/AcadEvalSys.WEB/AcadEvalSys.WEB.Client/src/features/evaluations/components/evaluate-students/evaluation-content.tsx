import { StudentForEvaluation } from "../../types/professor-evaluation";
import { ProfessorAssignmentFromApi } from "../../types/professor-evaluation";
import { CompetencyInfoCard } from "./competency-info-card";
import { AcademicInfoCard } from "./academic-info-card";
import { ProgressCard } from "./progress-card";
import { StudentsListCard } from "./students-list-card";
import {
  PageLayout,
  PageContent,
  PageSection,
} from "@/shared/components/layout/page-layout";

interface EvaluationContentProps {
  assignment: ProfessorAssignmentFromApi;
  students: StudentForEvaluation[];
  evaluatedStudents: StudentForEvaluation[];
  pendingStudents: StudentForEvaluation[];
  onEvaluateStudent: (student: StudentForEvaluation) => void;
}

export const EvaluationContent = ({
  assignment,
  students,
  evaluatedStudents,
  pendingStudents,
  onEvaluateStudent,
}: EvaluationContentProps) => {
  return (
    <PageLayout>
      <PageContent>
        <PageSection>
          {/* Header con botón de regreso */}
          <h1 className="text-3xl font-bold tracking-tight">
            Evaluar Competencia
          </h1>
          <p className="text-muted-foreground">
            Evalúa a los estudiantes en la competencia asignada
          </p>

          {/* Información de la asignación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <CompetencyInfoCard assignment={assignment} />
            <AcademicInfoCard assignment={assignment} />
          </div>

          {/* Estadísticas de progreso */}
          <div className="mb-8">
            <ProgressCard
              assignment={assignment}
              evaluatedCount={evaluatedStudents.length}
              pendingCount={pendingStudents.length}
            />
          </div>

          {/* Lista de estudiantes */}
          <StudentsListCard
            students={students}
            onEvaluateStudent={onEvaluateStudent}
          />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
};
