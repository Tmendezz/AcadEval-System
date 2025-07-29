import { Button } from "@/shared/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { TechnicalCareer } from "../types/technical-career";
import { ColumnDef } from "@tanstack/react-table";
import { navigate } from "wouter/use-browser-location";

export const careerColumns = (
  careerId: string
): ColumnDef<TechnicalCareer>[] => [
  {
    accessorKey: "name",
    header: "Nombre de la Carrera",
  },
  {
    accessorKey: "totalStudents",
    header: "Estudiantes",
  },
  {
    accessorKey: "totalProfessors",
    header: "Profesores",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de edición
        console.log("Editar carrera:", row.original.id);
      };

      const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de eliminación
        console.log("Eliminar carrera:", row.original.id);
      };

      const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/tecnicaturas/${careerId}/asignaturas/${row.original.id}`);
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
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="h-7 w-7 p-0"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      );
    },
  },
];
