import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import {
  getYearName,
  getYearKey,
  formatSubjectCount,
} from "../../../utils/wizard-utils";

interface YearSectionProps {
  careerId: string;
  year: number;
  subjectCount: number;
  assignmentCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  onAddAssignment: () => void;
  children: React.ReactNode;
}

export function YearSection({
  careerId,
  year,
  subjectCount,
  assignmentCount,
  isExpanded,
  onToggle,
  onAddAssignment,
  children,
}: YearSectionProps) {
  const yearKey = getYearKey(careerId, year);

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
        </div>
        <div className="flex items-center gap-2">
          {assignmentCount > 0 && (
            <Badge variant="secondary">
              {assignmentCount} asignación{assignmentCount !== 1 ? "es" : ""}
            </Badge>
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
            <Button onClick={onAddAssignment} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Asignación
            </Button>
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
