import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { GraduationCap, Target, Users, Mail, Star } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { DataTable } from "@/shared/components/data-table/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useGetAssignmentStudents } from "../../hooks";

interface CareerYearAssignmentDetail {
  assignmentId: string;
  competencyName: string;
  subjectName: string;
  professorName: string;
  status: string;
  totalStudentsCount: number;
  evaluatedStudentsCount: number;
  progressPercentage: number;
}

interface CompetencyGroup {
  competencyName: string;
  assignments: CareerYearAssignmentDetail[];
  totalStudents: number;
  evaluatedStudents: number;
  progressPercentage: number;
}

interface StudentData {
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: string;
  competencyLevel?: string;
}

interface CompetencyTabsProps {
  competencyGroups: CompetencyGroup[];
}

// Definición de columnas para la tabla de estudiantes
const columns: ColumnDef<StudentData>[] = [
  {
    accessorKey: "studentName",
    header: "Estudiante",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Users className="w-3 h-3 text-muted-foreground" />
        <span className="font-medium">{row.getValue("studentName")}</span>
      </div>
    ),
  },
  {
    accessorKey: "studentEmail",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Mail className="w-3 h-3 text-muted-foreground" />
        <span className="text-muted-foreground">
          {row.getValue("studentEmail")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={status === "Evaluated" ? "default" : "secondary"}
          className="text-xs"
        >
          {status === "Evaluated" ? "Evaluado" : "Pendiente"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "competencyLevel",
    header: "Nivel",
    cell: ({ row }) => {
      const level = row.getValue("competencyLevel") as string | undefined;
      return level ? (
        <div className="flex items-center gap-2">
          <Star className="w-3 h-3 text-muted-foreground" />
          <span>{level}</span>
        </div>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
];

export function CompetencyTabs({ competencyGroups }: CompetencyTabsProps) {
  const [selectedCompetency, setSelectedCompetency] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (competencyGroups.length > 0 && !selectedCompetency) {
      setSelectedCompetency(competencyGroups[0].competencyName);
    }
  }, [competencyGroups, selectedCompetency]);

  if (competencyGroups.length === 0) {
    return (
      <Card className="border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-muted-foreground" />
            Competencias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-base font-medium text-foreground mb-1">
              No hay competencias asignadas
            </h3>
            <p className="text-sm text-muted-foreground">
              Este año de carrera aún no tiene competencias asignadas.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-muted-foreground" />
          Competencias
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={competencyGroups[0]?.competencyName}
          className="w-full"
          onValueChange={setSelectedCompetency}
        >
          <TabsList className="flex flex-wrap w-full gap-1 p-1 bg-muted/30">
            {competencyGroups.map((competency) => (
              <TabsTrigger
                key={competency.competencyName}
                value={competency.competencyName}
                className="flex-1 min-w-0 flex items-center justify-center p-1.5 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-150"
              >
                <span className="truncate font-medium">
                  {competency.competencyName}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {competencyGroups.map((competency) => (
            <TabsContent
              key={competency.competencyName}
              value={competency.competencyName}
              className="mt-6"
            >
              <div className="space-y-4">
                <Card className="border-0 bg-muted/20">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Target className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-lg font-semibold text-foreground">
                          {competency.competencyName}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {competency.assignments.map((assignment) => (
                        <div
                          key={assignment.assignmentId}
                          className="space-y-4"
                        >
                          <div className="space-y-4 p-4 rounded-xl border border-border/50 bg-gradient-to-r from-card to-card/80 hover:from-card/90 hover:to-card/70 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group">
                            {/* Header: Profesor, Asignatura y Estado */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300">
                                  <Users className="w-5 h-5 text-primary" />
                                </div>
                                <div className="space-y-1">
                                  <div className="font-semibold text-foreground text-base">
                                    {assignment.professorName}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Target className="w-3 h-3 text-muted-foreground" />
                                    <span>{assignment.subjectName}</span>
                                  </div>
                                </div>
                              </div>

                              <Badge
                                variant={
                                  assignment.status === "Completed"
                                    ? "default"
                                    : "secondary"
                                }
                                className={`text-xs px-3 py-1.5 font-medium ${
                                  assignment.status === "Completed"
                                    ? "bg-green-500/20 text-green-600 border-green-500/30"
                                    : "bg-orange-500/20 text-orange-600 border-orange-500/30"
                                }`}
                              >
                                {assignment.status === "Completed"
                                  ? "✓ Completado"
                                  : "⏳ Pendiente"}
                              </Badge>
                            </div>

                            {/* Progreso simplificado */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground font-medium">
                                  Progreso de evaluación
                                </span>
                                <span className="font-semibold text-foreground">
                                  {Math.round(assignment.progressPercentage)}%
                                </span>
                              </div>
                              <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    assignment.progressPercentage === 100
                                      ? "bg-green-500"
                                      : assignment.progressPercentage > 0
                                      ? "bg-yellow-500"
                                      : "bg-orange-500"
                                  }`}
                                  style={{
                                    width: `${assignment.progressPercentage}%`,
                                  }}
                                />
                              </div>
                              <div className="text-xs text-muted-foreground text-center">
                                {assignment.evaluatedStudentsCount} de{" "}
                                {assignment.totalStudentsCount} estudiantes
                                evaluados
                              </div>
                            </div>
                          </div>

                          {/* Tabla de estudiantes mejorada */}
                          <div className="w-full">
                            <div className="mb-4">
                              <h5 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                Lista de Estudiantes
                              </h5>
                            </div>
                            <StudentsTable
                              assignmentId={assignment.assignmentId}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Componente auxiliar para la tabla de estudiantes
function StudentsTable({ assignmentId }: { assignmentId: string }) {
  const { data: students, isLoading } = useGetAssignmentStudents(
    assignmentId,
    true
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-6 w-full" />
        ))}
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="text-center py-4 text-xs text-muted-foreground bg-muted/20 rounded-lg">
        <Users className="w-4 h-4 mx-auto mb-2 text-muted-foreground" />
        No hay estudiantes asignados
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/50 bg-card/50">
      <DataTable columns={columns} data={students} />
    </div>
  );
}
