import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface GenericTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
}

export function GenericTooltip({
  content,
  children,
  side = "top",
  align = "center",
  delayDuration = 200,
  className,
}: GenericTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild className={className}>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="max-w-xs break-words">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
