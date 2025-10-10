import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { CompetencyDto as Competency } from "@/features/competencies/services/competency-service";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

interface ViewCompetencyModalProps {
  competency: Competency | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewCompetencyModal({
  competency,
  isOpen,
  onClose,
}: ViewCompetencyModalProps) {
  if (!competency) return null;

  const typeLabel = competency.type === "Soft" ? "Blanda" : "Técnica";
  const typeVariant = competency.type === "Soft" ? "secondary" : "default";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalle de Competencia</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Nombre
                </label>
                <p className="text-base font-semibold mt-1">{competency.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tipo
                </label>
                <div className="mt-1">
                  <Badge variant={typeVariant as "default" | "secondary"}>
                    {typeLabel}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Descripción
                </label>
                <p className="text-sm mt-1 leading-relaxed">
                  {competency.description}
                </p>
              </div>
            </div>

            {/* Niveles de competencia */}
            {competency.levels && competency.levels.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
                  Descripciones por nivel
                </label>
                <div className="space-y-3">
                  {["Inicial", "Intermedio", "Avanzado", "Excelente"].map((nivel) => {
                    const levelData = competency.levels?.find(
                      (l) => l.level === nivel
                    );
                    return (
                      <div
                        key={nivel}
                        className="rounded-lg border bg-muted/50 p-3"
                      >
                        <p className="text-xs font-semibold text-muted-foreground mb-1">
                          {nivel}
                        </p>
                        <p className="text-sm leading-relaxed">
                          {levelData?.description || "Sin descripción"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

