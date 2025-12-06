import { Card, CardContent } from "@/shared/components/ui/card";
import { Users, CheckCircle, Clock, Target } from "lucide-react";

interface YearSummaryCardProps {
  careerName: string;
  year: string;
  metrics: {
    completed: number;
    pending: number;
    total: number;
  };
}

export function YearSummaryCard({
  careerName,
  year,
  metrics,
}: YearSummaryCardProps) {
  const progressPercentage =
    metrics.total > 0
      ? Math.round((metrics.completed / metrics.total) * 100)
      : 0;

  return (
    <Card className="mb-6 border-0 bg-muted/20">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          {/* Información de la carrera */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Users className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {careerName} - {year} Año
                </h2>
                <p className="text-sm text-muted-foreground">
                  Resumen del progreso académico
                </p>
              </div>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {metrics.completed}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Completadas
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <Clock className="w-4 h-4 text-orange-600" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {metrics.pending}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Pendientes
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <Target className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {metrics.total}
                  </div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progreso principal */}
          <div className="text-center ml-6">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-muted-foreground/20">
              <div className="text-xl font-bold text-foreground">
                {progressPercentage}%
              </div>
            </div>
            <div className="mt-2 text-sm font-medium text-muted-foreground">
              Progreso
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
