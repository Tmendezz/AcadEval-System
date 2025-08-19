import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ChevronDown, ChevronRight, CheckCircle2, X } from "lucide-react";
import { Career } from "../../../types/evaluation-form";

interface CareerCardProps {
  career: Career;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isCompleted?: boolean;
  onRemove?: () => void;
}

export function CareerCard({
  career,
  isExpanded,
  onToggle,
  children,
  isCompleted = false,
  onRemove,
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
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                <CheckCircle2 className="w-4 h-4" /> Listo
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onRemove && (
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                aria-label="Quitar tecnicatura"
                title="Quitar tecnicatura"
              >
                <X className="w-4 h-4" />
              </button>
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
