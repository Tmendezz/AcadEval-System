import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Career } from "../../../types/evaluation-form";

interface CareerCardProps {
  career: Career;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CareerCard({
  career,
  isExpanded,
  onToggle,
  children,
}: CareerCardProps) {
  return (
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{career.name}</CardTitle>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
      </CardHeader>

      {isExpanded && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}
