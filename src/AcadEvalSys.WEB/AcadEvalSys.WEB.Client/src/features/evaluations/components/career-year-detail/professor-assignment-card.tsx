import { Badge } from "@/shared/components/ui/badge";
import { AssignmentStudentsList } from "./assignment-students-list";

interface ProfessorAssignmentCardProps {
  assignment: {
    assignmentId: string;
    professorName: string;
    subjectName: string;
    status: string;
    evaluatedStudentsCount: number;
    totalStudentsCount: number;
    progressPercentage: number;
  };
}

export function ProfessorAssignmentCard({
  assignment,
}: ProfessorAssignmentCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/30">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="font-medium text-sm text-foreground">
            {assignment.professorName}
          </div>
          <div className="text-xs text-muted-foreground">
            {assignment.subjectName}
          </div>
          <Badge
            variant={
              assignment.status === "Completed" ? "default" : "secondary"
            }
            className={`text-xs ${
              assignment.status === "Completed"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-yellow-100 text-yellow-700 border-yellow-200"
            }`}
          >
            {assignment.status === "Completed" ? "Completado" : "Pendiente"}
          </Badge>
        </div>

        <AssignmentStudentsList assignmentId={assignment.assignmentId} />
      </div>
    </div>
  );
}
