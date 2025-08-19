import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { useFinalizeEvaluation } from "../../hooks/evaluations/mutations/use-finalize-evaluation";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface FinalizeEvaluationButtonProps {
  evaluationId: string;
  evaluationTitle: string;
  completedAssignments: number;
  totalAssignments: number;
  isCompleted?: boolean;
}

export function FinalizeEvaluationButton({
  evaluationId,
  evaluationTitle,
  completedAssignments,
  totalAssignments,
  isCompleted = false,
}: FinalizeEvaluationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [forceClose, setForceClose] = useState(false);
  const finalizeEvaluationMutation = useFinalizeEvaluation();

  const isFullyCompleted = completedAssignments === totalAssignments;
  const progressPercentage =
    totalAssignments > 0
      ? Math.round((completedAssignments / totalAssignments) * 100)
      : 0;

  const handleFinalize = () => {
    finalizeEvaluationMutation.mutate(
      { evaluationId, forceClose },
      {
        onSuccess: (data) => {
          if (data.success) {
            setIsOpen(false);
          }
        },
      }
    );
  };

  if (isCompleted) {
    return (
      <Button disabled variant="outline" className="gap-2">
        <CheckCircle className="w-4 h-4 text-green-600" />
        Evaluación Finalizada
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isFullyCompleted ? "default" : "destructive"}
          className="gap-2"
        >
          {isFullyCompleted ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          Finalizar Evaluación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isFullyCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            )}
            Finalizar Evaluación
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas finalizar la evaluación "
            {evaluationTitle}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Estado actual */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Estado Actual</h4>
            <div className="flex items-center justify-between text-sm">
              <span>Progreso completado:</span>
              <span className="font-medium">
                {completedAssignments}/{totalAssignments} ({progressPercentage}
                %)
              </span>
            </div>
          </div>

          {/* Advertencias si no está completo */}
          {!isFullyCompleted && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <div className="flex gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-orange-800">
                    La evaluación no está completamente finalizada
                  </h4>
                  <p className="text-sm text-orange-700">
                    Aún hay {totalAssignments - completedAssignments}{" "}
                    asignaciones pendientes. Si finalizas ahora, los profesores
                    ya no podrán evaluar a sus estudiantes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Checkbox para forzar cierre */}
          {!isFullyCompleted && (
            <div className="flex items-start space-x-2">
              <Checkbox
                id="forceClose"
                checked={forceClose}
                onCheckedChange={(checked) => setForceClose(checked as boolean)}
              />
              <label
                htmlFor="forceClose"
                className="text-sm leading-5 cursor-pointer"
              >
                Entiendo que quedan evaluaciones pendientes y deseo finalizar de
                todas formas
              </label>
            </div>
          )}

          {/* Información adicional */}
          <div className="text-xs text-muted-foreground">
            <p>
              Una vez finalizada, la evaluación no se podrá reabrir y se
              generarán automáticamente los reportes correspondientes.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={finalizeEvaluationMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleFinalize}
            disabled={
              finalizeEvaluationMutation.isPending ||
              (!isFullyCompleted && !forceClose)
            }
            variant={isFullyCompleted ? "default" : "destructive"}
          >
            {finalizeEvaluationMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finalizando...
              </>
            ) : (
              "Confirmar Finalización"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
