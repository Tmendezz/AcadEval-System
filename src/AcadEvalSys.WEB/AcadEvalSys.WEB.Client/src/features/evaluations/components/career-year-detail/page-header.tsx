import { Link } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft } from "lucide-react";

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
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Link href={`/evaluaciones/${evaluationId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {evaluationTitle}
          </h1>
          <p className="text-muted-foreground">
            {careerName} - Año {year}
          </p>
        </div>
      </div>
    </div>
  );
}
