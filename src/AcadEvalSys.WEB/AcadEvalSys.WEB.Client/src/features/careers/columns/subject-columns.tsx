import { ColumnDef } from "@tanstack/react-table";
import { Users, GraduationCap, BookOpen } from "lucide-react";
import { Subject } from "@/shared/types";
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

      const handleClick = () => {
        if (careerId) {
          navigate(`/tecnicaturas/${careerId}/asignaturas/${subject.id}`);
        }
      };

      return (
        <div className="flex justify-end">
          <button
            onClick={handleClick}
            disabled={!careerId}
            className="text-sm text-primary font-medium hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            Ver detalle
          </button>
        </div>
      );
    },
  },
];
