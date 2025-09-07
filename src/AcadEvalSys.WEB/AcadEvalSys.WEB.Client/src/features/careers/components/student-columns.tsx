import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash, Users, Eye } from "lucide-react";
import { EnrolledStudent } from "@/shared/types";
import { Button } from "@/shared/components/ui/button";

export const studentColumns: ColumnDef<EnrolledStudent>[] = [
  {
    accessorKey: "studentName",
    header: "Estudiante",
    cell: ({ row }) => (
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Users className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-sm truncate">
            {row.original.studentName}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "studentEmail",
    header: "Email",
    cell: ({ row }) => (
      <p className="text-xs text-muted-foreground">
        {row.original.studentEmail}
      </p>
    ),
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de edición
        console.log("Editar estudiante:", row.original.studentId);
      };

      const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de eliminación
        console.log("Eliminar estudiante:", row.original.studentId);
      };

      const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de ver detalle
        console.log("Ver detalle estudiante:", row.original.studentId);
      };

      return (
        <div className="flex justify-end gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            className="h-7 w-7 p-0"
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="h-7 w-7 p-0"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="h-7 w-7 p-0"
          >
            <Trash className="h-3 w-3" />
          </Button>
        </div>
      );
    },
  },
];
