"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon, TrashIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/shared/components/ui/button";

import { Evaluation } from "../../../types";

// navegar al clickear fila a la ruta /evaluaciones/:id
// usar useRouter

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

      return (
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleEdit}>
            <PencilIcon className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDelete}>
            <TrashIcon className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
];
