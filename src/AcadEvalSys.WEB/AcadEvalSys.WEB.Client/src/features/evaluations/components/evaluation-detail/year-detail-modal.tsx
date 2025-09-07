import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Progress } from "@/shared/components/ui/progress";
import { CheckCircle, Clock, Users, Eye, GraduationCap, UserCheck } from "lucide-react";
import { CompetencyAssignmentDto } from "@infrastructure/api/types/evaluation";
import { api } from "@infrastructure/query/axios";

interface YearDetailModalProps {
  year: string;
  assignments: CompetencyAssignmentDto[];
  careerName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ProfessorAssignmentDetail {
  assignmentId: string;
  competencyName: string;
  subjectName: string;
  professorName: string;
  status: string;
  totalStudentsCount: number;
  evaluatedStudentsCount: number;
  progressPercentage: number;
}

export function YearDetailModal({ 
  year, 
  assignments, 
  careerName, 
  isOpen, 
  onClose 
}: YearDetailModalProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  const { data: assignmentDetails, isLoading } = useQuery({
    queryKey: ["assignment-details", selectedAssignment],
    queryFn: async (): Promise<ProfessorAssignmentDetail> => {
      if (!selectedAssignment) throw new Error("No assignment selected");
      const { data } = await api.get(`/professors/assignments/${selectedAssignment}/students`);
      return data;
    },
    enabled: !!selectedAssignment && isOpen,
  });

  const completedAssignments = assignments.filter(a => a.status === "Completed");
  const pendingAssignments = assignments.filter(a => a.status === "Pending");

  const handleAssignmentClick = (assignmentId: string) => {
    setSelectedAssignment(assignmentId);
  };

  const handleClose = () => {
    setSelectedAssignment(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div>Detalles del Año {year}</div>
              <div className="text-sm font-normal text-muted-foreground">{careerName}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumen del año */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Resumen del Año {year}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold text-green-700">{completedAssignments.length}</div>
                    <div className="text-sm text-green-600">Completadas</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold text-yellow-700">{pendingAssignments.length}</div>
                    <div className="text-sm text-yellow-600">Pendientes</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Users className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-700">{assignments.length}</div>
                    <div className="text-sm text-blue-600">Total</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de asignaciones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              Asignaciones de Profesores
            </h3>
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <Card 
                  key={assignment.assignmentId} 
                  className={`
                    cursor-pointer transition-all duration-200 hover:shadow-md
                    ${selectedAssignment === assignment.assignmentId 
                      ? 'ring-2 ring-primary/20 border-primary/30' 
                      : 'hover:border-primary/20'
                    }
                  `}
                >
                  <CardContent className="pt-4">
                    <div 
                      className="flex items-center justify-between"
                      onClick={() => handleAssignmentClick(assignment.assignmentId)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-lg">{assignment.professorName}</span>
                          <Badge
                            variant={assignment.status === "Completed" ? "default" : "secondary"}
                            className={
                              assignment.status === "Completed"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : "bg-yellow-100 text-yellow-700 border-yellow-200"
                            }
                          >
                            {assignment.status === "Completed" ? "Completado" : "Pendiente"}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div><strong>Competencia:</strong> {assignment.competencyName}</div>
                          <div><strong>Asignatura:</strong> {assignment.subjectName}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        Ver Alumnos
                      </Button>
                    </div>

                    {/* Detalles de la asignación seleccionada */}
                    {selectedAssignment === assignment.assignmentId && assignmentDetails && (
                      <div className="mt-6 pt-4 border-t border-border/50">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            <h4 className="font-semibold text-lg">Información de Alumnos</h4>
                            {isLoading && <div className="text-sm text-muted-foreground">Cargando...</div>}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <div>
                                <div className="text-xl font-bold text-green-700">
                                  {assignmentDetails.evaluatedStudentsCount}
                                </div>
                                <div className="text-sm text-green-600">Alumnos Evaluados</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <Clock className="w-5 h-5 text-yellow-600" />
                              <div>
                                <div className="text-xl font-bold text-yellow-700">
                                  {assignmentDetails.totalStudentsCount - assignmentDetails.evaluatedStudentsCount}
                                </div>
                                <div className="text-sm text-yellow-600">Alumnos Pendientes</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <Users className="w-5 h-5 text-blue-600" />
                              <div>
                                <div className="text-xl font-bold text-blue-700">
                                  {assignmentDetails.totalStudentsCount}
                                </div>
                                <div className="text-sm text-blue-600">Total de Alumnos</div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-4">
                              <Progress value={assignmentDetails.progressPercentage} className="flex-1" />
                              <span className="font-semibold text-lg min-w-[60px] text-right">
                                {Math.round(assignmentDetails.progressPercentage)}%
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground text-center">
                              Progreso de evaluación de alumnos
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Profesores pendientes destacados */}
          {pendingAssignments.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Profesores Pendientes - Requieren Atención
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {pendingAssignments.map((assignment) => (
                    <div key={assignment.assignmentId} className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200 shadow-sm">
                      <div className="flex-1">
                        <div className="font-semibold text-yellow-800">{assignment.professorName}</div>
                        <div className="text-sm text-yellow-700">
                          {assignment.competencyName} • {assignment.subjectName}
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        Pendiente
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 