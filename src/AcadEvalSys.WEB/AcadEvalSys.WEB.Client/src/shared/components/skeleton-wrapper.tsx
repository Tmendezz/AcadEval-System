import { ReactNode } from "react";
import { 
  ListSkeleton, 
  CardGridSkeleton, 
  TableSkeleton, 
  FormSkeleton,
  DetailSkeleton,
  CardSkeleton,
  StatsSkeleton,
  TextSkeleton
} from "./ui/skeletons";

interface SkeletonWrapperProps {
  children: ReactNode;
  isLoading: boolean;
  fallback?: ReactNode;
  variant?: "list" | "grid" | "table" | "form" | "detail" | "card" | "stats" | "text";
  count?: number;
  className?: string;
}

/**
 * Wrapper que muestra un skeleton mientras está cargando
 * y el contenido real cuando termina de cargar
 */
export function SkeletonWrapper({
  children,
  isLoading,
  fallback,
  variant = "list",
  count,
  className,
}: SkeletonWrapperProps) {
  if (isLoading) {
    if (fallback) {
      return <div className={className}>{fallback}</div>;
    }

    switch (variant) {
      case "grid":
        return <div className={className}><CardGridSkeleton count={count} /></div>;
      
      case "list":
        return <div className={className}><ListSkeleton count={count} /></div>;
      
      case "table":
        return <div className={className}><TableSkeleton rows={count} /></div>;
      
      case "form":
        return <div className={className}><FormSkeleton fields={count} /></div>;
      
      case "detail":
        return <div className={className}><DetailSkeleton /></div>;
      
      case "card":
        return <div className={className}><CardSkeleton /></div>;
      
      case "stats":
        return <div className={className}><StatsSkeleton count={count} /></div>;
      
      case "text":
        return <div className={className}><TextSkeleton lines={count} /></div>;
      
      default:
        return <div className={className}><ListSkeleton count={count} /></div>;
    }
  }

  return <>{children}</>;
}
