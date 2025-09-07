import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Users } from "lucide-react";
import { CompetencyAssignmentByCareerYearDto } from "@infrastructure/api/types/evaluation";

import { CareerYearCard } from "@/features/evaluations/components/evaluation-detail/career-year-card";

interface CareerAssignmentsSectionProps {
  assignmentsByCareer: CompetencyAssignmentByCareerYearDto[];
  evaluationId: string;
}

export function CareerAssignmentsSection({
  assignmentsByCareer,
  evaluationId,
}: CareerAssignmentsSectionProps) {
  if (!assignmentsByCareer || assignmentsByCareer.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No hay asignaciones de carreras
          </h3>
          <p className="text-sm text-muted-foreground">
            Esta evaluación aún no tiene carreras técnicas asignadas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tecnicaturas evaluadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {assignmentsByCareer.map((career) => (
            <div key={career.careerName} className="rounded-lg border bg-card">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold text-lg text-foreground">
                  {career.careerName}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {Object.keys(career.assignments).length} años
                </span>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(career.assignments).map(
                  ([yearKey, assignments]) => (
                    <CareerYearCard
                      key={yearKey}
                      year={yearKey}
                      assignments={assignments}
                      careerName={career.careerName}
                      careerId={career.careerId}
                      evaluationId={evaluationId}
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
