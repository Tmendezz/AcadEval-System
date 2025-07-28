import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Competency } from "@/shared/types";
import { ChevronRight, Target, Brain } from "lucide-react";
import { nameToSlug } from "@/shared/lib/utils";

interface CompetencyCardProps {
  competency: Competency;
}

export function CompetencyCard({ competency }: CompetencyCardProps) {
  return (
    <Link href={`/evaluations/competencies/${competency.id}`}>
      <Card className="group w-full h-full p-0 border border-border/60 shadow-sm hover:shadow-md hover:border-border transition-all duration-300 cursor-pointer bg-card hover:scale-[1.01] active:scale-[0.99]">
        <CardHeader className="p-6 space-y-4">
          <div className="flex justify-between items-start gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border border-border/40 ${
                  competency.type === "Soft"
                    ? "bg-primary/10 text-primary"
                    : "bg-chart-4/10 text-chart-4"
                }`}
              >
                {competency.type === "Soft" ? (
                  <Brain className="w-5 h-5" />
                ) : (
                  <Target className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors duration-200 truncate">
                  {competency.name}
                </CardTitle>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge
                variant="secondary"
                className={`font-medium text-xs px-3 py-1 rounded-full ${
                  competency.type === "Soft"
                    ? "bg-primary/10 text-primary"
                    : "bg-chart-4/10 text-chart-4"
                }`}
              >
                {competency.type === "Soft" ? "Blandas" : "Duras"}
              </Badge>

              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-card-foreground group-hover:translate-x-1 transition-all duration-200" />
            </div>
          </div>

          <CardDescription className="text-sm text-muted-foreground leading-relaxed line-clamp-2 group-hover:text-muted-foreground/80 transition-colors duration-200">
            {competency.description}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
