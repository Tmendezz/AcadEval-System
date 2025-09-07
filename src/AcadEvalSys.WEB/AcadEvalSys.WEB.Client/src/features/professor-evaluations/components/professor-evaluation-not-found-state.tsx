import { AlertCircle } from "lucide-react";

export function ProfessorEvaluationNotFoundState() {
  return (
    <div className="text-center py-12">
      <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-semibold mb-2">Asignación no encontrada</h3>
      <p className="text-muted-foreground">
        La asignación solicitada no existe o no tienes acceso a ella.
      </p>
    </div>
  );
}
