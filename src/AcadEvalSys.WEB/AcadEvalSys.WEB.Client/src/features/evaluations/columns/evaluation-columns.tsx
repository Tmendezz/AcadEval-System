"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, TrashIcon, Eye } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/shared/components/ui/button";

import { Evaluation } from "@/shared/types/evaluation";
import { Badge } from "@/shared/components/ui/badge";
import { navigate } from "wouter/use-browser-location";

export const columns: ColumnDef<Evaluation>[] = [
  {
    id: "title",
    accessorKey: "title",
    header: "Título",
    cell: ({ row }) => {
      return (
        <div className="text-sm w-40 font-medium">{row.original.title}</div>
      );
    },
  },
  {
    id: "semester",
    accessorKey: "semester",
    header: "Semestre",
    cell: ({ row }) => {
      return (
        <Badge variant="outline">
          {row.original.semester === "First"
            ? "Primer Semestre"
            : "Segundo Semestre"}
        </Badge>
      );
    },
  },
  {
    id: "periodFrom",
    accessorKey: "periodFrom",
    header: "Fecha de inicio",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground truncate">
          {format(new Date(row.original.periodFrom), "dd/MM/yyyy")}
        </div>
      );
    },
  },
  {
    id: "periodTo",
    accessorKey: "periodTo",
    header: "Fecha de fin",
    cell: ({ row }) => {
      return (
        <div className="text-sm text-muted-foreground truncate">
          {format(new Date(row.original.periodTo), "dd/MM/yyyy")}
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
        navigate(`/evaluaciones/${row.original.id}`);
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
