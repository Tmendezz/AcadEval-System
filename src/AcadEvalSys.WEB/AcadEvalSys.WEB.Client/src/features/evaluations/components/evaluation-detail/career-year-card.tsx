import { memo, useMemo } from "react";
import { Users, ChevronRight } from "lucide-react";
import { CompetencyAssignmentDto } from "../../models";
import { Link } from "wouter";

interface CareerYearCardProps {
  year: string;
  assignments: CompetencyAssignmentDto[];
  careerName: string;
  evaluationId: string;
  careerId: string;
  showDetailsButton?: boolean;
}

export const CareerYearCard = memo(function CareerYearCard({
  year,
  assignments,
  careerName,
  careerId,
  evaluationId,
  showDetailsButton = true,
}: CareerYearCardProps) {
  // Memoizar cálculos de progreso
  const { completedCount, totalCount, pct } = useMemo(() => {
    const completed = assignments.filter((a) => a.status === "Completed");
    return {
      completedCount: completed.length,
      totalCount: assignments.length,
      pct: Math.round((completed.length / Math.max(assignments.length, 1)) * 100),
    };
  }, [assignments]);

  // Memoizar URL para evitar recreación
  const detailUrl = useMemo(
    () => `/evaluaciones/${evaluationId}/carrera/${careerId}/año/${year.replace("°", "")}`,
    [evaluationId, careerId, year]
  );

  return (
    <Link href={detailUrl}>
      <div className="rounded-xl p-4 transition-all duration-200 cursor-pointer border bg-card hover:shadow-md hover:border-primary/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{year} Año</h3>
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
            <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 text-sm text-foreground font-medium">
            {completedCount}/{totalCount} completadas ({pct}%)
          </div>
        </div>
      </div>
    </Link>
  );
});
