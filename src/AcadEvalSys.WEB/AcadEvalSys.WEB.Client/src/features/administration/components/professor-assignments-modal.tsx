import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { AlertTriangle, BookOpen, GraduationCap } from "lucide-react";

// Constantes fuera del componente para evitar recreación
const YEAR_LABELS: Record<number, string> = {
  1: "Primer Año",
  2: "Segundo Año",
  3: "Tercer Año",
};

interface SubjectAssignment {
  id: string;
  name: string;
  careerName: string;
  year: number;
}

interface ProfessorAssignmentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  professorName: string;
  assignedSubjects: SubjectAssignment[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const ProfessorAssignmentsModal = memo(function ProfessorAssignmentsModal({
  open,
  onOpenChange,
  professorName,
  assignedSubjects,
  onConfirm,
  onCancel,
}: ProfessorAssignmentsModalProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Profesor con Asignaturas Asignadas
          </DialogTitle>
          <DialogDescription>
            El profesor <strong>{professorName}</strong> está asignado a las
            siguientes asignaturas. Para eliminarlo, primero debe desasignarlo
            de todas las asignaturas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Acción Requerida</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Debe desasignar al profesor de todas las asignaturas antes de
                  poder eliminarlo. Esto se puede hacer desde la gestión de
                  carreras.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">
              Asignaturas Asignadas ({assignedSubjects.length})
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {assignedSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {subject.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <GraduationCap className="w-3 h-3 mr-1" />
                          {subject.careerName}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {YEAR_LABELS[subject.year] || `Año ${subject.year}`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

