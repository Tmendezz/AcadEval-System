import React from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
// import { Badge } from "@/shared/components/ui/badge";
import { Trash2 } from "lucide-react";
import {
  Assignment,
  Competency,
  Subject,
} from "../../../models/evaluation-form";
import { SmartSelect } from "@/shared/components/ui/smart-select";

interface AssignmentFormProps {
  assignment: Assignment;
  competencies: Competency[];
  subjects: Subject[];
  onUpdate: (field: "competencyId" | "subjectId", value: string) => void;
  onRemove: () => void;
}

export function AssignmentForm({
  assignment,
  competencies,
  subjects,
  onUpdate,
  onRemove,
}: AssignmentFormProps) {
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove();
  };

  const handleSubjectChange = (value: string) => {
    onUpdate("subjectId", value);
  };

  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="space-y-2">
            <Label>Competencia</Label>
            <div className="h-9 flex items-center text-sm px-3 py-2 rounded-md border bg-muted/50">
              {competencies.find((c) => c.id === assignment.competencyId)
                ?.name || "Sin competencia"}
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <Label>Asignatura</Label>
            <SmartSelect
              value={assignment.subjectId ?? ""}
              onValueChange={handleSubjectChange}
              placeholder="Asignar profesor/asignatura"
              options={subjects}
              renderOption={(subject) => (
                <div className=" flex items-center gap-2">
                  <span className="font-medium">{subject.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {subject.professorName
                      ? `Prof. ${subject.professorName}`
                      : "Sin profesor asignado"}
                  </span>
                </div>
              )}
              triggerClassName=" min-w-[360px]"
            />
          </div>

          <div className="flex items-center justify-end self-center mt-4">
            <Button
              onClick={handleRemove}
              variant="outline"
              size="sm"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
