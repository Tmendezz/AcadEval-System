import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Career } from "@/features/evaluations";

interface CareerCardProps {
  career: Career;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isCompleted?: boolean;
  onRemove?: () => void;
  completedYears?: number;
  totalYears?: number;
}

export function CareerCard({
  career,
  isExpanded,
  onToggle,
  children,
  onRemove,
  completedYears = 0,
  totalYears = 3,
}: CareerCardProps) {
  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{career.name}</CardTitle>
            <Badge
              variant={completedYears === totalYears ? "default" : "secondary"}
            >
              {completedYears}/{totalYears}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {onRemove && (
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="h-8 px-3 gap-1"
                title="Quitar tecnicatura"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Quitar</span>
              </Button>
            )}
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}
