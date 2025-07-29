import { ColumnDef } from "@tanstack/react-table";
import {
  Users,
  GraduationCap,
  BookOpen,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Subject } from "@/shared/types";
import { Button } from "@/shared/components/ui/button";
import { navigate } from "wouter/use-browser-location";

export const createSubjectColumns = (
  careerId?: string
): ColumnDef<Subject>[] => [
  {
    accessorKey: "name",
    header: "Asignatura",
    cell: ({ row }) => {
      const subject = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm truncate">{subject.name}</p>
          </div>
        </div>
      );
    },
  },

  {
    accessorKey: "enrolledStudents",
    header: "Estudiantes",
    cell: ({ row }) => {
      const subject = row.original;
      const studentCount = subject.enrolledStudents?.length || 0;
      return (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{studentCount}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "professorName",
    header: "Profesor",
    cell: ({ row }) => {
      const subject = row.original;
      return (
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {subject.professorName || "Sin asignar"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      const subject = row.original;

      const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de edición
        console.log("Editar asignatura:", subject.id);
      };

      const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: Implementar lógica de eliminación
        console.log("Eliminar asignatura:", subject.id);
      };

      const handleView = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (careerId) {
          navigate(`/tecnicaturas/${careerId}/asignaturas/${subject.id}`);
        }
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
