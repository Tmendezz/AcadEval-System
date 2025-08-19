import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Users } from "lucide-react";
import { CompetencyAssignmentByCareerYearDto } from "@/shared/types/evaluation";
import { CareerYearCard } from "@/shared/components/career-year-card";

interface CareerAssignmentsSectionProps {
  assignmentsByCareer: CompetencyAssignmentByCareerYearDto[];
  evaluationId: string;
}

export function CareerAssignmentsSection({ assignmentsByCareer, evaluationId }: CareerAssignmentsSectionProps) {
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
        <CardTitle>Carreras Técnicas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {assignmentsByCareer.map((career) => (
            <div key={career.careerName} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-4 text-chart-4">
                {career.careerName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(career.assignments).map(([year, assignments]) => (
                  <CareerYearCard
                    key={year}
                    year={year}
                    assignments={assignments}
                    careerName={career.careerName}
                    evaluationId={evaluationId}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 