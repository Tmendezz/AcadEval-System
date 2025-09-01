import { Users, ChevronRight } from "lucide-react";
import { CompetencyAssignmentDto } from "@/shared/types/evaluation";
import { Link } from "wouter";

interface CareerYearCardProps {
  year: string;
  assignments: CompetencyAssignmentDto[];
  careerName: string;
  evaluationId: string;
  careerId: string;
  showDetailsButton?: boolean;
}

export function CareerYearCard({
  year,
  assignments,
  careerName,
  careerId,
  evaluationId,
  showDetailsButton = true,
}: CareerYearCardProps) {
  const completed = assignments.filter((a) => a.status === "Completed");

  const pct = Math.round(
    (completed.length / Math.max(assignments.length, 1)) * 100
  );

  return (
    <Link
      href={`/evaluaciones/${evaluationId}/carrera/${careerId}/año/${year.replace(
        "°",
        ""
      )}`}
    >
      <div className="rounded-xl p-4 transition-all duration-200 cursor-pointer border bg-card hover:shadow-md hover:border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {year} Año
              </h3>
              <p className="text-xs text-muted-foreground">{careerName}</p>
            </div>
          </div>
          {showDetailsButton && (
            <div className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <span className="text-sm font-medium">Ver progreso</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>

        <div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-foreground font-medium">
            {completed.length}/{assignments.length} completadas ({pct}%)
          </div>
        </div>
      </div>
    </Link>
  );
}
