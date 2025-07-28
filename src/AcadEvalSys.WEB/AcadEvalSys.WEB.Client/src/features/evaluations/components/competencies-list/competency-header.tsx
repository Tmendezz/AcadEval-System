import { PlusCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface CompetencyHeaderProps {
  onNewCompetency: () => void;
}

export function CompetencyHeader({ onNewCompetency }: CompetencyHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Gestión de Competencias
        </h2>
        <p className="text-muted-foreground">
          Administra las competencias para evaluaciones
        </p>
      </div>
      <Button onClick={onNewCompetency}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Nueva Competencia
      </Button>
    </div>
  );
}
