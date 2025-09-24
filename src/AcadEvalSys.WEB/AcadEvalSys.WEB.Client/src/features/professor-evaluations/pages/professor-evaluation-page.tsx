import { useRoute } from "wouter";
import { useState } from "react";
import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useGetAllProfessorAssignments } from "../hooks";
import { useProfessorAssignment, useAssignmentStudents } from "../hooks";
import { ProfessorEvaluationContent } from "../components/professor-evaluation-content";
import { ProfessorEvaluationList } from "../components/professor-evaluation-list";
import { ProfessorEvaluationModal } from "../components/professor-evaluation-modal";
import { ProfessorEvaluationLoadingState } from "../components/professor-evaluation-loading-state";
import { ProfessorEvaluationNotFoundState } from "../components/professor-evaluation-not-found-state";
import { StudentForEvaluation } from "../models";

export function ProfessorEvaluationPage() {
  const [isEvaluationRoute, params] = useRoute(
    "/profesor/evaluaciones/:assignmentId"
  );

  const { data: assignmentsData, isLoading: isLoadingList } =
    useGetAllProfessorAssignments();
  const [selectedStudent, setSelectedStudent] =
    useState<StudentForEvaluation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEvaluateStudent = (student: StudentForEvaluation) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleEvaluationComplete = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  // Professor-specific hooks
  const assignmentId = params?.assignmentId || "";
  const { data: assignment, isLoading: isLoadingAssignment } =
    useProfessorAssignment(assignmentId);
  const { data: studentsRaw, isLoading: isLoadingStudents } =
    useAssignmentStudents(assignmentId);

  // Normalizar listado de estudiantes: usa endpoint dedicado si es array,
  // de lo contrario toma del detalle de la asignación.
  const students: StudentForEvaluation[] = Array.isArray(studentsRaw)
    ? studentsRaw
    : (assignment?.studentEvaluations as unknown as StudentForEvaluation[]) || [];

  const evaluatedStudents = students.filter(
    (student: StudentForEvaluation) => student.status === "Evaluated"
  );
  const pendingStudents = students.filter(
    (student: StudentForEvaluation) => student.status === "Pending"
  );
  const isLoadingDetails = isLoadingAssignment || isLoadingStudents;

  const assignments = assignmentsData || [];

  return (
    <PageLayout>
      <PageHeader
        title="Mis Evaluaciones"
        description="Gestiona las evaluaciones de competencias asignadas"
      >
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Evaluación
        </Button>
      </PageHeader>

      <PageContent>
        {isEvaluationRoute ? (
          <>
            {isLoadingDetails && <ProfessorEvaluationLoadingState />}
            {!isLoadingDetails && !assignment && (
              <ProfessorEvaluationNotFoundState />
            )}
            {!isLoadingDetails && assignment && (
              <>
                <ProfessorEvaluationContent
                  assignment={assignment}
                  students={students}
                  evaluatedStudents={evaluatedStudents}
                  pendingStudents={pendingStudents}
                  onEvaluateStudent={handleEvaluateStudent}
                />
                {selectedStudent && (
                  <ProfessorEvaluationModal
                    student={selectedStudent}
                    assignmentId={assignmentId || ""}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onEvaluationComplete={handleEvaluationComplete}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <ProfessorEvaluationList
            evaluations={assignments}
            isLoading={isLoadingList}
          />
        )}
      </PageContent>
    </PageLayout>
  );
}
