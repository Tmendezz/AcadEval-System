import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Componente que trunca texto y muestra tooltip con el texto completo
 */
export function TruncatedText({
  text,
  maxLength = 30,
  className = "",
  children,
}: TruncatedTextProps) {
  // Si hay children, usarlos como contenido, sino usar text
  const content = children || text;
  const contentString = typeof content === 'string' ? content : String(content);
  const shouldTruncate = contentString.length > maxLength;
  const truncatedText = shouldTruncate 
    ? contentString.slice(0, maxLength) + '...'
    : contentString;

  if (!shouldTruncate) {
    return <span className={className}>{content}</span>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`${className} cursor-help`}>{truncatedText}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs break-words">{text || contentString}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
