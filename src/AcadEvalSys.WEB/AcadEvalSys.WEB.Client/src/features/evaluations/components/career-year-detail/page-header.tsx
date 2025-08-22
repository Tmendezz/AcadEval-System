import { GraduationCap, Calendar } from "lucide-react";

interface PageHeaderProps {
  evaluationTitle: string;
  careerName: string;
  year: string;
  evaluationId: string;
}

export function PageHeader({
  evaluationTitle,
  careerName,
  year,
  evaluationId,
}: PageHeaderProps) {
  return (
    <div>
      {/* Título principal */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {evaluationTitle}
        </h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            <span>{careerName}</span>
          </div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full" />
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Año {year}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
