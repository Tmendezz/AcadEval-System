import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Star, User, Mail, Calendar, MessageSquare } from "lucide-react";
import {
  StudentForEvaluation,
  CompetencyLevel,
} from "../../types/professor-evaluation";
import { useAssessStudent, useUpdateStudentAssessment } from "../../hooks";
import { toast } from "sonner";

interface StudentEvaluationFormProps {
  student: StudentForEvaluation;
  assignmentId: string;
  onEvaluationComplete: () => void;
}

const competencyLevels: CompetencyLevel[] = [
  "Ninguno",
  "Inicial",
  "Intermedio",
  "Avanzado",
  "Excelente",
];

const competencyLevelColors = {
  Ninguno: "bg-gray-500/20 text-gray-600 border-gray-500/30",
  Inicial: "bg-blue-500/20 text-blue-600 border-blue-500/30",
  Intermedio: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
  Avanzado: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  Excelente: "bg-green-500/20 text-green-600 border-green-500/30",
};

export function StudentEvaluationForm({
  student,
  assignmentId,
  onEvaluationComplete,
}: StudentEvaluationFormProps) {
  const [competencyLevel, setCompetencyLevel] = useState<CompetencyLevel>(
    student.competencyLevel || "Ninguno"
  );
  const [observations, setObservations] = useState(student.observations || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const assessStudentMutation = useAssessStudent();
  const updateAssessmentMutation = useUpdateStudentAssessment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (student.status === "Evaluated") {
        // Actualizar evaluación existente
        await updateAssessmentMutation.mutateAsync({
          assignmentId,
          studentId: student.studentId,
          assessment: {
            competencyLevel,
            observations: observations.trim() || undefined,
          },
        });
        toast.success("Evaluación actualizada correctamente");
      } else {
        // Crear nueva evaluación
        await assessStudentMutation.mutateAsync({
          assignmentId,
          studentId: student.studentId,
          competencyLevel,
          observations: observations.trim() || undefined,
        });
        toast.success("Estudiante evaluado correctamente");
      }

      onEvaluationComplete();
    } catch (error) {
      toast.error("Error al evaluar estudiante");
      console.error("Error evaluating student:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = competencyLevel !== "Ninguno";

  return (
    <Card className="border-0 bg-gradient-to-r from-card to-card/80">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Evaluar Estudiante
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información del estudiante */}
          <div className="space-y-4 p-4 rounded-xl border border-border/50 bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground text-lg">
                  {student.studentName}
                </h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{student.studentEmail}</span>
                  </div>
                  {student.assessmentDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Evaluado:{" "}
                        {new Date(student.assessmentDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Estado actual */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Estado:</span>
              <Badge
                variant={
                  student.status === "Evaluated" ? "default" : "secondary"
                }
                className="text-xs"
              >
                {student.status === "Evaluated" ? "✓ Evaluado" : "⏳ Pendiente"}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs ${
                  student.competencyLevel
                    ? competencyLevelColors[student.competencyLevel]
                    : "bg-gray-500/20 text-gray-600 border-gray-500/30"
                }`}
              >
                <Star className="w-3 h-3 mr-1" />
                {student.competencyLevel || "Sin calificar"}
              </Badge>
            </div>
          </div>

          {/* Formulario de evaluación */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nivel de Competencia
              </label>
              <Select
                value={competencyLevel}
                onValueChange={(value: CompetencyLevel) =>
                  setCompetencyLevel(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  {competencyLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        {level}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Observaciones (opcional)
              </label>
              <Textarea
                placeholder="Agregar comentarios sobre la evaluación del estudiante..."
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Puedes agregar comentarios específicos sobre el desempeño del
                estudiante en esta competencia.
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              {student.status === "Evaluated"
                ? "Actualizando evaluación existente..."
                : "Creando nueva evaluación..."}
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCompetencyLevel(student.competencyLevel || "Ninguno");
                  setObservations(student.observations || "");
                }}
                disabled={isSubmitting}
              >
                Restaurar
              </Button>

              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="min-w-32"
              >
                {isSubmitting
                  ? "Guardando..."
                  : student.status === "Evaluated"
                  ? "Actualizar Evaluación"
                  : "Evaluar Estudiante"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
