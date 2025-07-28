import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/cn";

interface EntityCardProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
  };
  stats?: Array<{
    icon: ReactNode;
    label: string;
    value: string | number;
  }>;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

export function EntityCard({
  title,
  subtitle,
  badge,
  stats,
  onClick,
  className,
  children,
}: EntityCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-lg",
        onClick && "cursor-pointer hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {badge && (
            <Badge variant={badge.variant || "secondary"}>{badge.text}</Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>
        {stats && (
          <div className="space-y-3">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="text-muted-foreground">{stat.icon}</div>
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <span className="font-semibold">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
