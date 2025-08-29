import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useGetAssignmentStudents } from "../../hooks";
import { Users, Mail, Star } from "lucide-react";

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
  const { data: students, isLoading } = useGetAssignmentStudents(
    assignmentId,
    true // Siempre expandido
  );

  return (
    <div className="mt-3 border-t border-border/50 pt-3">
      <div className="mb-3">
        <h5 className="text-xs font-medium text-muted-foreground">
          Lista de Estudiantes
        </h5>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <table className="w-full text-xs">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                  Estudiante
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                  Email
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                  Estado
                </th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                  Nivel
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students?.map((student: AssignmentStudent) => (
                <tr key={student.studentId} className="hover:bg-muted/30">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="font-medium">{student.studentName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {student.studentEmail}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <Badge
                      variant={
                        student.status === "Evaluated" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {student.status === "Evaluated"
                        ? "Evaluado"
                        : "Pendiente"}
                    </Badge>
                  </td>
                  <td className="px-3 py-2">
                    {student.competencyLevel ? (
                      <div className="flex items-center gap-2">
                        <Star className="w-3 h-3 text-muted-foreground" />
                        <span>{student.competencyLevel}</span>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-800 border-gray-200 text-xs"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Sin calificar
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!students || students.length === 0) && (
            <div className="text-center py-8 text-xs text-muted-foreground bg-muted/20">
              <Users className="w-4 h-4 mx-auto mb-2 text-muted-foreground" />
              No hay estudiantes asignados
            </div>
          )}
        </div>
      )}
    </div>
  );
}
