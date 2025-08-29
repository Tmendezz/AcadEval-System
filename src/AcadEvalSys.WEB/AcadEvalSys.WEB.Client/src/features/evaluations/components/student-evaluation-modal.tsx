import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Star, User, BookOpen, Calendar } from "lucide-react";
import {
  StudentForEvaluation,
  StudentAssessmentRequest,
} from "../types/professor-evaluation";
import {
  useAssessStudent,
  useUpdateStudentAssessment,
} from "../hooks/professor-evaluations";
import { toast } from "sonner";

interface StudentEvaluationModalProps {
  student: StudentForEvaluation;
  assignmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

const competencyLevels = [
  {
    value: "Ninguno",
    label: "Ninguno",
    description: "No demuestra la competencia",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  {
    value: "Inicial",
    label: "Inicial",
    description: "Demuestra un nivel básico de la competencia",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  {
    value: "Intermedio",
    label: "Intermedio",
    description: "Demuestra un nivel moderado de la competencia",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  {
    value: "Avanzado",
    label: "Avanzado",
    description: "Demuestra un nivel alto de la competencia",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  {
    value: "Excelente",
    label: "Excelente",
    description: "Demuestra un dominio excepcional de la competencia",
    color: "bg-green-100 text-green-800 border-green-200",
  },
];

export function StudentEvaluationModal({
  student,
  assignmentId,
  isOpen,
  onClose,
}: StudentEvaluationModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>(
    student.competencyLevel || "Ninguno"
  );
  const [observations, setObservations] = useState<string>(
    student.observations || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const assessStudentMutation = useAssessStudent();
  const updateStudentMutation = useUpdateStudentAssessment();

  const isNewAssessment = student.status === "Pending";
  const mutation = isNewAssessment
    ? assessStudentMutation
    : updateStudentMutation;

  const handleSubmit = async () => {
    if (!selectedLevel) {
      toast.error("Debes seleccionar un nivel de competencia");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isNewAssessment) {
        const assessment: StudentAssessmentRequest = {
          assignmentId,
          studentId: student.studentId,
          competencyLevel: selectedLevel as any,
          observations: observations.trim() || undefined,
        };
        await assessStudentMutation.mutateAsync(assessment);
        toast.success("Estudiante evaluado correctamente");
      } else {
        await updateStudentMutation.mutateAsync({
          assignmentId,
          studentId: student.studentId,
          assessment: {
            competencyLevel: selectedLevel as any,
            observations: observations.trim() || undefined,
          },
        });
        toast.success("Evaluación actualizada correctamente");
      }

      // Cerrar modal y refrescar datos
      onClose();
      queryClient.invalidateQueries({
        queryKey: ["assignment-students", assignmentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["professor-assignment", assignmentId],
      });
    } catch (error) {
      console.error("Error al evaluar estudiante:", error);
      toast.error("Error al evaluar al estudiante. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Star className="w-4 h-4 text-primary" />
            </div>
            <div>
              <div>Evaluar Estudiante</div>
              <div className="text-sm font-normal text-muted-foreground">
                {student.studentName}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del estudiante */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {student.studentName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {student.studentEmail}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge
                    variant={
                      student.status === "Evaluated" ? "default" : "outline"
                    }
                  >
                    {student.status === "Evaluated" ? "Evaluado" : "Pendiente"}
                  </Badge>
                </div>
                {student.assessmentDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Evaluado:</span>
                    <span>
                      {new Date(student.assessmentDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Selección de nivel de competencia */}
          <Card>
            <CardContent className="pt-6">
              <Label className="text-base font-medium mb-4 block">
                Nivel de Competencia
              </Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un nivel" />
                </SelectTrigger>
                <SelectContent>
                  {competencyLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={level.color}>
                          <Star className="w-3 h-3 mr-1" />
                          {level.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {level.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Observaciones */}
          <Card>
            <CardContent className="pt-6">
              <Label
                htmlFor="observations"
                className="text-base font-medium mb-3 block"
              >
                Observaciones (Opcional)
              </Label>
              <Textarea
                id="observations"
                placeholder="Agrega comentarios sobre la evaluación del estudiante..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Las observaciones ayudan a documentar el razonamiento de la
                evaluación.
              </p>
            </CardContent>
          </Card>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting
                ? "Guardando..."
                : isNewAssessment
                ? "Evaluar"
                : "Actualizar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
