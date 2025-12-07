import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ChevronDown, ChevronRight, Plus, CheckCircle2, Trash2 } from "lucide-react";
import { getYearName, formatSubjectCount } from "../../../utils/wizard-utils";

interface YearSectionProps {
  // careerId retained previously, remove to avoid unused param warnings
  year: number;
  subjectCount: number;
  assignmentCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  onAddAssignment?: () => void;
  children: React.ReactNode;
  isCompleted?: boolean;
  showAddButton?: boolean;
  onRemove?: () => void;
  onAdd?: () => void;
}

export function YearSection({
  year,
  subjectCount,
  assignmentCount,
  isExpanded,
  onToggle,
  onAddAssignment,
  children,
  isCompleted = false,
  showAddButton = true,
  onRemove,
  onAdd,
}: YearSectionProps) {
  return (
    <div className="border rounded-lg">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <Badge variant="outline">{getYearName(year)}</Badge>
          <span className="text-sm text-muted-foreground">
            {formatSubjectCount(subjectCount)}
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="w-4 h-4" /> Listo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {assignmentCount > 0 && (
            <Badge variant="secondary">
              {assignmentCount} asignación{assignmentCount !== 1 ? "es" : ""}
            </Badge>
          )}
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              title="Remover año completo"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          {onAdd && assignmentCount === 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2"
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
              title="Agregar año"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Agregar
            </Button>
          )}
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Asignaturas del {getYearName(year)}</h4>
            {showAddButton && onAddAssignment && (
              <Button
                onClick={onAddAssignment}
                variant="outline"
                size="sm"
                type="button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Asignación
              </Button>
            )}
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
