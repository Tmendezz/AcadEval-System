import { Link } from "wouter";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Evaluation } from "@/shared/types/evaluation";

interface EvaluationHeaderProps {
  evaluation: Evaluation;
}

export function EvaluationHeader({ evaluation }: EvaluationHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Link href="/evaluaciones">
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Volver
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {evaluation.title}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {evaluation.description}
          </p>
        </div>
      </div>
    </div>
  );
} 