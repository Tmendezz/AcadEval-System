import { Badge } from "@/shared/components/ui/badge";
import { UserCheck } from "lucide-react";

interface Coordinator {
  name: string;
  email: string;
}

interface CareerCoordinatorCardProps {
  coordinator?: Coordinator;
}

export function CareerCoordinatorCard({
  coordinator,
}: CareerCoordinatorCardProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold leading-none tracking-tight">
            Coordinador
          </span>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="text-2xl font-bold">
          {coordinator ? coordinator.name : "Sin asignar"}
        </div>
        <p className="text-xs text-muted-foreground">
          {coordinator ? coordinator.email : "No hay coordinador asignado"}
        </p>
        {coordinator && (
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              Coordinador asignado
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
