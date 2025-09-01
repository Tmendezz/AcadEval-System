import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { User, BookOpen, Calendar, Target } from "lucide-react";
import {
  StudentForEvaluation,
  StudentAssessmentRequest,
  CompetencyLevel,
} from "../types/professor-evaluation";
import {
  useAssessStudent,
  useUpdateStudentAssessment,
  useGetProfessorAssignmentById,
} from "../hooks/professor-evaluations";
import { useCompetencies } from "@/shared/hooks/use-competencies";
import { toast } from "sonner";

interface StudentEvaluationModalProps {
  student: StudentForEvaluation;
  assignmentId: string;
  isOpen: boolean;
  onClose: () => void;
  onEvaluationComplete?: () => void;
}

// Configuración escalable de niveles de competencia
const COMPETENCY_LEVELS = [
  {
    value: "Inicial",
    label: "Inicial",
    color: {
      background: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      selected: "bg-red-400",
      selectedText: "text-white",
    },
  },
  {
    value: "Intermedio",
    label: "Intermedio",
    color: {
      background: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
      selected: "bg-yellow-400",
      selectedText: "text-white",
    },
  },
  {
    value: "Avanzado",
    label: "Avanzado",
    color: {
      background: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
      selected: "bg-blue-500",
      selectedText: "text-white",
    },
  },
  {
    value: "Excelente",
    label: "Excelente",
    color: {
      background: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
      selected: "bg-green-500",
      selectedText: "text-white",
    },
  },
] as const;

export function StudentEvaluationModal({
  student,
  assignmentId,
  isOpen,
  onClose,
  onEvaluationComplete,
}: StudentEvaluationModalProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>(
    student.competencyLevel || "Inicial"
  );
  const [observations, setObservations] = useState<string>(
    student.observations || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const assessStudentMutation = useAssessStudent();
  const updateStudentMutation = useUpdateStudentAssessment();

  // Obtener información de la competencia
  const { data: assignment } = useGetProfessorAssignmentById(assignmentId);

  // Obtener todas las competencias para buscar la descripción de la competencia actual
  const { data: competencies } = useCompetencies();

  // Encontrar la competencia actual basada en el nombre
  const currentCompetency = competencies?.find(
    (comp) => comp.name === assignment?.competencyName
  );

  // Actualizar el estado cuando cambie el estudiante
  useEffect(() => {
    setSelectedLevel(student.competencyLevel || "Inicial");
    setObservations(student.observations || "");
  }, [student]);

  const isNewAssessment = student.status === "Pending";

  const handleSubmit = async () => {
    if (
      !selectedLevel ||
      !["Inicial", "Intermedio", "Avanzado", "Excelente"].includes(
        selectedLevel
      )
    ) {
      toast.error("Debes seleccionar un nivel de competencia válido");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isNewAssessment) {
        const assessment: StudentAssessmentRequest = {
          assignmentId,
          studentId: student.studentId,
          competencyLevel: selectedLevel as CompetencyLevel,
          observations: observations.trim() || undefined,
        };
        await assessStudentMutation.mutateAsync(assessment);
        toast.success("Estudiante evaluado correctamente");
      } else {
        await updateStudentMutation.mutateAsync({
          assignmentId,
          studentId: student.studentId,
          assessment: {
            competencyLevel: selectedLevel as CompetencyLevel,
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

      // Llamar al callback de evaluación completada
      onEvaluationComplete?.();
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

  // Obtener las descripciones de los niveles desde la base de datos
  const getCompetencyLevels = () => {
    // Crear un mapa de las descripciones de nivel si están disponibles
    const levelDescriptionsMap = currentCompetency?.levels
      ? new Map(
          currentCompetency.levels.map((level) => [
            level.level,
            level.description,
          ])
        )
      : new Map();

    return COMPETENCY_LEVELS.map((level) => ({
      ...level,
      description:
        levelDescriptionsMap.get(level.value) ||
        `Nivel ${level.label.toLowerCase()} de la competencia`,
    }));
  };

  const competencyLevels = getCompetencyLevels();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Evaluar Estudiante
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la competencia */}
          {assignment && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {assignment.competencyName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {assignment.competencyDescription}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
              <div className="space-y-3">
                {competencyLevels.map((level) => {
                  const isSelected = selectedLevel === level.value;
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => setSelectedLevel(level.value)}
                      className={`w-full text-left p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                        isSelected
                          ? `${level.color.selected} ${level.color.selectedText} shadow-md border-transparent`
                          : `${level.color.background} ${level.color.text} ${level.color.border} hover:bg-opacity-80`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? "border-white" : "border-current"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{level.label}</div>
                          <div
                            className={`text-sm mt-1 ${
                              isSelected ? "opacity-90" : "opacity-80"
                            }`}
                          >
                            {level.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
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
