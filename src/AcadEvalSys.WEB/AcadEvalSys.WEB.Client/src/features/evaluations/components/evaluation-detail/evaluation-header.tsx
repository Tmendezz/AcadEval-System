import { Link } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Evaluation } from "../../models";

interface EvaluationHeaderProps {
  evaluation: Evaluation;
}

export function EvaluationHeader({ evaluation }: EvaluationHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/evaluaciones">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {evaluation.title}
            </h1>
            {evaluation.description && (
              <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                {evaluation.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
