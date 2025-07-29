import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/shared/lib/cn";
import { useBreadcrumbs } from "@/shared/hooks/use-breadcrumbs";

export function Breadcrumb() {
  const { breadcrumbs } = useBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center justify-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}

          {item.path ? (
            <Link
              href={item.path}
              className={cn(
                "hover:text-foreground transition-colors text-center",
                item.isActive && "text-foreground font-medium"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                "text-foreground text-center",
                item.isActive && "font-medium"
              )}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
