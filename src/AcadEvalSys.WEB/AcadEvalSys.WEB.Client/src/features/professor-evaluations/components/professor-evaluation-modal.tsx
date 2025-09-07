import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
// Badge import removed as it's not used
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";
import { User, BookOpen, Calendar, Target } from "lucide-react";
import { StudentForEvaluation, CompetencyLevel } from "../models";

interface ProfessorEvaluationModalProps {
  student: StudentForEvaluation;
  assignmentId: string;
  isOpen: boolean;
  onClose: () => void;
  onEvaluationComplete: () => void;
}

export function ProfessorEvaluationModal({
  student,
  assignmentId,
  isOpen,
  onClose,
  onEvaluationComplete,
}: ProfessorEvaluationModalProps) {
  const competencyLevels: CompetencyLevel[] = [
    "Inicial",
    "Intermedio",
    "Avanzado",
    "Excelente",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement assessment submission
    onEvaluationComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Evaluar Competencia</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">
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
                  <span>Asignación: {assignmentId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Fecha: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Form */}
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="competencyLevel"
                className="text-base font-medium"
              >
                Nivel de Competencia
              </Label>
              <p className="text-sm text-muted-foreground mb-3">
                Selecciona el nivel de competencia que mejor describe el
                desempeño del estudiante
              </p>
              <div className="grid grid-cols-2 gap-2">
                {competencyLevels.map((level) => (
                  <label
                    key={level}
                    className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                  >
                    <input
                      type="radio"
                      name="competencyLevel"
                      value={level}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="comments" className="text-base font-medium">
                Comentarios (Opcional)
              </Label>
              <textarea
                id="comments"
                name="comments"
                rows={3}
                className="w-full mt-2 p-3 border rounded-lg resize-none"
                placeholder="Agrega comentarios sobre el desempeño del estudiante..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              <Target className="w-4 h-4 mr-2" />
              Guardar Evaluación
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
