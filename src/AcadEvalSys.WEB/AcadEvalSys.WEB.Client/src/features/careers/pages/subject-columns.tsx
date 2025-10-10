import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Trash2, Eye, Users } from "lucide-react";
import { Subject } from "../models/subject";
import { UseMutationResult } from "@tanstack/react-query";
import { Link } from "wouter";

export function createSubjectColumns(
  careerId?: string,
  deleteSubjectMutation?: UseMutationResult<void, Error, string>
): ColumnDef<Subject>[] {
  return [
    {
      accessorKey: "name",
      header: "Nombre de la Asignatura",
      cell: ({ row }) => {
        const subject = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{subject.name}</span>
            {subject.description && (
              <span className="text-sm text-muted-foreground">
                {subject.description}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "year",
      header: "Año",
      cell: ({ row }) => {
        const year = row.original.year;
        const yearLabels = {
          First: "Primer Año",
          Second: "Segundo Año",
          Third: "Tercer Año",
        };
        
        return (
          <Badge variant="outline">
            {yearLabels[year as keyof typeof yearLabels] || year}
          </Badge>
        );
      },
    },
    {
      accessorKey: "professorName",
      header: "Profesor Asignado",
      cell: ({ row }) => {
        const professor = row.original.professorName;
        return professor ? (
          <span className="text-sm">{professor}</span>
        ) : (
          <span className="text-sm text-muted-foreground">Sin asignar</span>
        );
      },
    },
    {
      accessorKey: "enrolledStudents",
      header: "Estudiantes",
      cell: ({ row }) => {
        const studentsCount = row.original.enrolledStudents?.length || 0;
        return (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{studentsCount}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const subject = row.original;
        
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <Link href={`/carreras/${careerId}/asignaturas/${subject.id}`}>
                <Eye className="h-4 w-4" />
                Ver
              </Link>
            </Button>
            
            {deleteSubjectMutation && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteSubjectMutation.mutate(subject.id)}
                disabled={deleteSubjectMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}
