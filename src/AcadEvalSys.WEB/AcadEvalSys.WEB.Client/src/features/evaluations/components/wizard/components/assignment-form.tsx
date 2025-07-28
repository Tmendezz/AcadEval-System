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
import { Trash2 } from "lucide-react";
import {
  Assignment,
  Competency,
  Subject,
} from "../../../types/evaluation-form";

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
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Competencia</Label>
            <Select
              value={assignment.competencyId}
              onValueChange={(value) => onUpdate("competencyId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar competencia" />
              </SelectTrigger>
              <SelectContent>
                {competencies.map((competency) => (
                  <SelectItem key={competency.id} value={competency.id}>
                    <div className="flex items-center gap-2">
                      <span>{competency.name}</span>
                      <Badge
                        variant={
                          competency.type === "Soft" ? "secondary" : "default"
                        }
                        className="text-xs"
                      >
                        {competency.type === "Soft" ? "Blanda" : "Técnica"}
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
              onValueChange={(value) => onUpdate("subjectId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar asignatura" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{subject.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {subject.professorName
                          ? `Prof. ${subject.professorName}`
                          : "Sin profesor asignado"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={onRemove}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
