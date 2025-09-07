import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@infrastructure/lib/cn";
import { filterOptionsById } from "@shared/utils/unique-options";

interface AssignmentOption {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

interface AssignmentPanelProps {
  title: string;
  icon: ReactNode;
  currentAssignment?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  availableOptions: AssignmentOption[];
  onAssign: (id: string) => void;
  onUnassign?: (id: string) => void;
  selectedId: string;
  onSelectedIdChange: (id: string) => void;
  isLoading?: boolean;
  className?: string;
  /** Opcional: IDs que deben ocultarse del selector por estar ocupados */
  excludedIds?: Set<string>;
}

export function AssignmentPanel({
  title,
  icon,
  currentAssignment,
  availableOptions,
  onAssign,
  onUnassign,
  selectedId,
  onSelectedIdChange,
  isLoading = false,
  className,
  excludedIds,
}: AssignmentPanelProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Assignment */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {currentAssignment?.name
                  ? currentAssignment.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : "NA"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {currentAssignment?.name || "Sin asignación"}
              </h3>
              {currentAssignment?.email && (
                <p className="text-sm text-muted-foreground">
                  {currentAssignment.email}
                </p>
              )}
            </div>
          </div>
          {currentAssignment && <Badge variant="default">Asignado</Badge>}
        </div>

        {/* Assignment Controls */}
        <div className="space-y-4">
          <label className="text-sm font-medium">Asignar Nuevo</label>
          <div className="flex space-x-2">
            <Select value={selectedId} onValueChange={onSelectedIdChange}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {filterOptionsById(
                  availableOptions,
                  excludedIds ?? new Set(),
                  selectedId
                ).map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name} {option.email && `(${option.email})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => onAssign(selectedId)}
              disabled={!selectedId || isLoading}
            >
              {isLoading ? "Asignando..." : "Asignar"}
            </Button>
          </div>
        </div>

        {/* Unassign Button */}
        {currentAssignment && onUnassign && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onUnassign(currentAssignment.id)}
              disabled={isLoading}
            >
              Desasignar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
