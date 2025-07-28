import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash, Users } from "lucide-react";
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
    cell: ({ row }) => (
      <div className="flex justify-end gap-4">
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4" />
          Editar
        </Button>
        <Button variant="outline" size="sm">
          <Trash className="h-4 w-4" />
          Eliminar
        </Button>
      </div>
    ),
  },
];
