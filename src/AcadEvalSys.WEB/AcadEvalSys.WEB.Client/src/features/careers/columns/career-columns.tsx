import { Button } from "@/shared/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export const careerColumns = [
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
    cell: () => (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
];
