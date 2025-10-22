import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { Assignment } from "../../../types/evaluation-form";
import {
  useCompetencies,
  useSubjectsByCareer,
} from "@/features/evaluations/hooks";
import {
  buildExclusionSet,
  filterOptionsById,
} from "@shared/utils/unique-options";

interface CompetencyAssignmentsStepProps {
  assignments: Assignment[];
  onAssignmentsChange: (assignments: Assignment[]) => void;
}

export function CompetencyAssignmentsStep({
  assignments,
  onAssignmentsChange,
}: CompetencyAssignmentsStepProps) {
  const addAssignment = () => {
    onAssignmentsChange([...assignments, { competencyId: "", subjectId: "" }]);
  };

  const removeAssignment = (index: number) => {
    onAssignmentsChange(assignments.filter((_, i) => i !== index));
  };

  const updateAssignment = (
    index: number,
    field: "competencyId" | "subjectId",
    value: string
  ) => {
    const newAssignments = [...assignments];
    newAssignments[index][field] = value;
    onAssignmentsChange(newAssignments);
  };

  const { data: competencies = [] } = useCompetencies();
  const { data: subjects = [] } = useSubjectsByCareer("", undefined, true);

  // Excluir competencias ya usadas en la lista completa
  const usedCompetencyIds = buildExclusionSet(
    assignments,
    (a) => a.competencyId || undefined,
    (a) => !a.competencyId
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Asignaciones de Competencias</h3>
        {/* Botón deshabilitado si ya alcanzó el número de competencias */}
        <Button
          onClick={addAssignment}
          variant="outline"
          size="sm"
          type="button"
          disabled={assignments.length >= competencies.length}
        >
          <Plus className="w-4 h-4 mr-2" />
          Agregar Asignación
        </Button>
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-muted-foreground rounded-lg">
          <p className="text-muted-foreground">
            No hay asignaciones configuradas. Haz clic en "Agregar Asignación"
            para comenzar.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Competencia</Label>
                    <Select
                      value={assignment.competencyId}
                      onValueChange={(value) =>
                        updateAssignment(index, "competencyId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar competencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptionsById(
                          competencies,
                          usedCompetencyIds,
                          assignment.competencyId
                        ).map((competency) => (
                          <SelectItem key={competency.id} value={competency.id}>
                            <div className="flex items-center gap-2">
                              <span>{competency.name}</span>
                              <Badge
                                variant={
                                  competency.type === "Soft"
                                    ? "secondary"
                                    : "default"
                                }
                                className="text-xs"
                              >
                                {competency.type === "Soft"
                                  ? "Blanda"
                                  : "Técnica"}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Asignatura</Label>
                    <Select
                      value={assignment.subjectId}
                      onValueChange={(value) =>
                        updateAssignment(index, "subjectId", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar asignatura" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {subject.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {subject.year}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={() => removeAssignment(index)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
