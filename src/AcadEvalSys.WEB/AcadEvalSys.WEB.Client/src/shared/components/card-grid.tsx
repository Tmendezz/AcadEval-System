import { ReactNode } from "react";

interface CardGridProps<T> {
  data: T[];
  children: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export function CardGrid<T>({
  data,
  children,
  keyExtractor = (_, index) => index,
  columns = { sm: 1, md: 2, lg: 3 },
  gap = 4,
  className = "",
}: CardGridProps<T>) {
  // Generar clases de grid dinámicamente
  const gridClasses = [
    `grid`,
    `gap-${gap}`,
    columns.sm && `grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={gridClasses}>
      {data.map((item, index) => (
        <div key={keyExtractor(item, index)}>{children(item, index)}</div>
      ))}
    </div>
  );
}
