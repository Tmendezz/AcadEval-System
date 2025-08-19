import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useGetAssignmentStudents } from "../../hooks";
import {
  Users,
  ChevronDown,
  ChevronUp,
  Mail,
  BookOpen,
  Star,
} from "lucide-react";

interface AssignmentStudent {
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: "Evaluated" | "Pending";
  evaluatedAt?: string;
  competencyLevel?: string;
}

interface AssignmentStudentsListProps {
  assignmentId: string;
}

export function AssignmentStudentsList({
  assignmentId,
}: AssignmentStudentsListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: students, isLoading } = useGetAssignmentStudents(
    assignmentId,
    isExpanded
  );

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(true)}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        <Users className="w-3 h-3 mr-1" />
        Ver estudiantes
        <ChevronDown className="w-3 h-3 ml-1" />
      </Button>
    );
  }

  return (
    <div className="mt-3 border-t border-border/50 pt-3">
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-xs font-medium text-muted-foreground">
          Lista de Estudiantes
        </h5>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
          className="text-xs"
        >
          <ChevronUp className="w-3 h-3" />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {students?.map((student: AssignmentStudent) => (
            <div
              key={student.studentId}
              className="flex items-center justify-between p-2 rounded border border-border/30 bg-background/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium">
                    {student.studentName}
                  </span>
                  <Badge
                    variant={
                      student.status === "Evaluated" ? "default" : "secondary"
                    }
                    className={`text-xs ${
                      student.status === "Evaluated"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-yellow-100 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {student.status === "Evaluated" ? "Evaluado" : "Pendiente"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{student.studentEmail}</span>
                  </div>
                  {student.competencyLevel && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>Nivel: {student.competencyLevel}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(!students || students.length === 0) && (
            <div className="text-center py-4 text-xs text-muted-foreground">
              No hay estudiantes asignados
            </div>
          )}
        </div>
      )}
    </div>
  );
}
