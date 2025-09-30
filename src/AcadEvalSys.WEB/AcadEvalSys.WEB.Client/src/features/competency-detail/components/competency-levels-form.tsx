import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/shared/components/ui/card";
import {Competency} from "@features/competencies";

interface CompetencyLevelsFormProps {
  competency: Competency;
}

const defaultLevels = ["Inicial", "Intermedio", "Avanzado", "Excelente"];

export function CompetencyLevelsForm({
  competency,
}: CompetencyLevelsFormProps) {
  return (
    <div className="space-y-4">
      {defaultLevels.map((level) => {
        const existingLevel = competency.levels?.find((l) => l.level === level);

        return (
          <Card key={level} className="border-l-4 border-l-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-medium">
                  {level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {existingLevel?.description || "Sin descripción definida"}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
