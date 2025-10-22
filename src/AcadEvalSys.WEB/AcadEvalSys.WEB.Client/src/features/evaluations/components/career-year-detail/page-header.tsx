import { GraduationCap, Calendar } from "lucide-react";

interface PageHeaderProps {
  evaluationTitle: string;
  careerName: string;
  year: string;
  evaluationId: string;
}

export function PageHeader({ evaluationTitle }: PageHeaderProps) {
  return (
    <div>
      {/* Título principal */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          {evaluationTitle}
        </h1>
      </div>
    </div>
  );
}
