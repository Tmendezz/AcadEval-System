import { ReactNode } from "react";
import { cn } from "@infrastructure/lib/cn";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="mx-auto px-4 py-8 space-y-8">{children}</div>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center space-x-2">{children}</div>
      )}
    </div>
  );
}

interface PageContentProps {
  children: ReactNode;
  className?: string;
}

export function PageContent({ children, className }: PageContentProps) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

export function PageSection({ children, className }: PageSectionProps) {
  return <div className={cn("space-y-4", className)}>{children}</div>;
}
