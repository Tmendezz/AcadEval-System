import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/data-table/data-table";
import { LoadingState, EmptyState } from "./loading-state";
import { cn } from "@infrastructure/lib/cn";

interface DataSectionProps<TData> {
  title?: ReactNode;
  description?: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  onRowClick?: (id: string) => void;
  className?: string;
  children?: ReactNode;
  headerActions?: ReactNode;
}

export function DataSection<TData>({
  title,
  description,
  data,
  columns,
  isLoading = false,
  emptyMessage = "No se encontraron datos",
  emptyIcon,
  onRowClick,
  className,
  children,
  headerActions,
}: DataSectionProps<TData>) {
  return (
    <Card className={cn("", className)}>
      {(title || headerActions || description) && (
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            {title && <CardTitle>{title}</CardTitle>}
            {headerActions}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
      )}
      <CardContent>
        {isLoading ? (
          <LoadingState message="Cargando datos..." />
        ) : data.length > 0 ? (
          <>
            <DataTable columns={columns} data={data} onRowClick={onRowClick} />
            {children}
          </>
        ) : (
          <EmptyState
            title={emptyMessage}
            icon={
              <div className="flex items-center justify-center w-10 h-10 mx-auto">
                {emptyIcon}
              </div>
            }
          />
        )}
      </CardContent>
    </Card>
  );
}
