import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { Professor } from "../models";

interface CoordinatorSectionProps {
  currentCoordinator?: {
    userId: string;
    name: string;
    email: string;
    phone?: string;
  } | null;
  selectedCoordinator: string;
  onCoordinatorChange: (coordinatorId: string) => void;
  coordinatorCandidates: Professor[];
}

export function CoordinatorSection({
  currentCoordinator,
  selectedCoordinator,
  onCoordinatorChange,
  coordinatorCandidates,
}: CoordinatorSectionProps) {
  return (
    <Card className="p-4 space-y-3">
      <label className="text-sm font-medium">Coordinador de la carrera</label>

      {/* Mostrar coordinador actual si existe */}
      {currentCoordinator && (
        <div className="p-3 bg-muted/50 rounded-md border">
          <p className="text-sm font-medium">Coordinador actual:</p>
          <p className="text-sm text-muted-foreground">
            {currentCoordinator.name} ({currentCoordinator.email})
            {currentCoordinator.phone && ` - ${currentCoordinator.phone}`}
          </p>
        </div>
      )}

      <Select value={selectedCoordinator} onValueChange={onCoordinatorChange}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccione un coordinador entre los profesores de las materias" />
        </SelectTrigger>
        <SelectContent>
          {coordinatorCandidates.map((professor) => (
            <SelectItem key={professor.id} value={professor.id}>
              {professor.name}
              {currentCoordinator?.userId === professor.id && " (actual)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <p className="text-xs text-muted-foreground">
        Solo se muestran profesores que dictan materias en esta carrera
      </p>

      {/* Validación en tiempo real */}
      {selectedCoordinator &&
        selectedCoordinator !== currentCoordinator?.userId && (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            Profesor seleccionado como nuevo coordinador
          </div>
        )}

      {!selectedCoordinator && currentCoordinator && (
        <div className="p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
          ⚠️ Se quitará el coordinador actual
        </div>
      )}

      {/* Botón para quitar coordinador */}
      {currentCoordinator && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCoordinatorChange("")}
          className="w-full"
        >
          Quitar coordinador actual
        </Button>
      )}
    </Card>
  );
}
