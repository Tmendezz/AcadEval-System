import { StudentEvaluationModal } from "../components/student-evaluation-modal";
import { useEvaluationPageState } from "../hooks/professor-evaluations/use-evaluation-page-state";
import { EvaluationLoadingState } from "../components/evaluate-students/evaluation-loading-state";
import { EvaluationNotFoundState } from "../components/evaluate-students/evaluation-not-found-state";
import { EvaluationContent } from "../components/evaluate-students/evaluation-content";

export default function EvaluateStudentsPage() {
  const {
    assignmentId,
    assignment,
    students,
    evaluatedStudents,
    pendingStudents,
    selectedStudent,
    isModalOpen,
    isLoading,

    handleEvaluateStudent,
    handleCloseModal,
    handleEvaluationComplete,
  } = useEvaluationPageState();

  // Estado de carga
  if (isLoading) {
    return <EvaluationLoadingState />;
  }

  // Asignación no encontrada
  if (!assignment) {
    return <EvaluationNotFoundState />;
  }

  return (
    <>
      <EvaluationContent
        assignment={assignment}
        students={students}
        evaluatedStudents={evaluatedStudents}
        pendingStudents={pendingStudents}
        onEvaluateStudent={handleEvaluateStudent}
      />

      {/* Modal de evaluación */}
      {selectedStudent && (
        <StudentEvaluationModal
          student={selectedStudent}
          assignmentId={assignmentId || ""}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEvaluationComplete={handleEvaluationComplete}
        />
      )}
    </>
  );
}
