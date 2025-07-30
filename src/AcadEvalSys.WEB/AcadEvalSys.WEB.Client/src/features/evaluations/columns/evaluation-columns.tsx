"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, TrashIcon, Eye } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/shared/components/ui/button";

import { Evaluation } from "@/shared/types";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import { cn } from "@/shared/lib/cn";

export const columns: ColumnDef<Evaluation>[] = [
  {
    id: "title",
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => {
      return <div className="text-sm font-medium">{row.original.title}</div>;
    },
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground truncate">
          {row.original.description}
        </div>
      );
    },
  },
  {
    id: "semester",
    accessorKey: "semester",
    header: "Semestre",
    cell: ({ row }) => {
      return (
        <Badge
          className={cn(
            row.original.semester === "First"
              ? "bg-indigo-500/20 text-indigo-500"
              : "bg-orange-500/20 text-orange-500"
          )}
        >
          {row.original.semester === "First"
            ? "Primer Semestre"
            : "Segundo Semestre"}
        </Badge>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.status === "Pending"
              ? "outline"
              : row.original.status === "Completed"
              ? "default"
              : "destructive"
          }
        >
          {row.original.status === "Pending"
            ? "Pendiente"
            : row.original.status === "Completed"
            ? "Completado"
            : "Cerrado"}
        </Badge>
      );
    },
  },
  {
    id: "progressBar",
    accessorKey: "progressBar",
    header: "Progreso",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 justify-between items-center w-3/4">
          <Progress
            value={50}
            className="h-2 bg-primary/20 border border-primary/20"
          />
          <span className="text-sm font-medium">50%</span>
        </div>
      );
    },
  },
  {
    id: "period",
    accessorKey: "period",
    header: "Periodo",
    cell: ({ row }) => {
      return (
        <div className="text-sm flex flex-col items-start">
          {format(new Date(row.original.periodFrom), "dd/MM/yyyy")}
          <span className="text-muted-foreground text-xs">
            hasta {format(new Date(row.original.periodTo), "dd/MM/yyyy")}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de edición
        console.log("Editar evaluación:", row.original.id);
      };

      const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de eliminación
        console.log("Eliminar evaluación:", row.original.id);
      };

      const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de ver detalle
        console.log("Ver detalle evaluación:", row.original.id);
      };

      return (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            className="h-7 w-7 p-0"
          >
            <Eye className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-7 w-7 p-0"
          >
            <PencilIcon className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="h-7 w-7 p-0"
          >
            <TrashIcon className="w-3 h-3" />
          </Button>
        </div>
      );
    },
  },
];
