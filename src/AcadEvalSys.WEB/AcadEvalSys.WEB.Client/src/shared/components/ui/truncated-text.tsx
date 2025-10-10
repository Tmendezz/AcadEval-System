import React from "react";
import { GenericTooltip } from "./generic-tooltip";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  showTooltip?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export function TruncatedText({
  text,
  maxLength = 50,
  className = "",
  showTooltip = true,
  side = "top",
  align = "center",
}: TruncatedTextProps) {
  const shouldTruncate = text.length > maxLength;
  const displayText = shouldTruncate ? `${text.substring(0, maxLength)}...` : text;

  if (!shouldTruncate || !showTooltip) {
    return <span className={className}>{displayText}</span>;
  }

  return (
    <GenericTooltip content={text} side={side} align={align}>
      <span className={`cursor-help ${className}`}>{displayText}</span>
    </GenericTooltip>
  );
}
