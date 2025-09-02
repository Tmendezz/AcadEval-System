import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Edit, Trash2, Key } from "lucide-react";
import { Student } from "../services/student-service";

interface StudentColumnsProps {
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onChangePassword: (student: Student, newPassword: string) => Promise<void>;
}

export const studentColumns = ({
  onEdit,
  onDelete,
  onChangePassword,
}: StudentColumnsProps): ColumnDef<Student>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {student.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{student.name}</div>
            <div className="text-sm text-muted-foreground">{student.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "technicalCareerName",
    header: "Carrera",
    cell: ({ row }) => {
      const career = row.getValue("technicalCareerName") as string;
      return (
        <Badge variant="outline" className="text-xs">
          {career}
        </Badge>
      );
    },
  },
  {
    accessorKey: "currentYear",
    header: "Año",
    cell: ({ row }) => {
      const year = row.getValue("currentYear") as number;
      const yearLabels = {
        1: "Primer Año",
        2: "Segundo Año",
        3: "Tercer Año",
      };
      return (
        <Badge variant="secondary" className="text-xs">
          {yearLabels[year as keyof typeof yearLabels] || `Año ${year}`}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;
      return (
        <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
          {isActive ? "Activo" : "Inactivo"}
        </Badge>
      );
    },
  },

  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const student = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(student)}
            className="h-8 w-8 p-0"
            title="Editar estudiante"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(student)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            title="Eliminar estudiante"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
