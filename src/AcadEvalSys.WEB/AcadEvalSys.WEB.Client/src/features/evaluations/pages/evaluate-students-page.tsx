import { StudentEvaluationModal } from "@/features/professor-evaluations/components";
import { EvaluationContent } from "../components/evaluate-students/evaluation-content";

interface EvaluateStudentsPageProps {
  assignmentId: string;
  assignment: { id: string; name: string };
  students: { id: string; name: string; email: string }[];
  evaluatedStudents: { id: string; name: string; email: string }[];
  pendingStudents: { id: string; name: string; email: string }[];
  selectedStudent: { id: string; name: string; email: string } | null;
  isModalOpen: boolean;
  onEvaluateStudent: (student: { id: string; name: string; email: string }) => void;
  onCloseModal: () => void;
  onEvaluationComplete: () => void;
}

export default function EvaluateStudentsPage({
  assignmentId,
  assignment,
  students,
  evaluatedStudents,
  pendingStudents,
  selectedStudent,
  isModalOpen,
  onEvaluateStudent,
  onCloseModal,
  onEvaluationComplete,
}: EvaluateStudentsPageProps) {
  return (
    <>
      <EvaluationContent
        assignment={assignment}
        students={students}
        evaluatedStudents={evaluatedStudents}
        pendingStudents={pendingStudents}
        onEvaluateStudent={onEvaluateStudent}
      />

      {selectedStudent && (
        <StudentEvaluationModal
          student={selectedStudent}
          assignmentId={assignmentId || ""}
          isOpen={isModalOpen}
          onClose={onCloseModal}
          onEvaluationComplete={onEvaluationComplete}
        />
      )}
    </>
  );
}
