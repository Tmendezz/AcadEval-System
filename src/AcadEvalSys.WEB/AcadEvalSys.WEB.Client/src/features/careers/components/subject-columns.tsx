import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Eye, Users } from "lucide-react";
import { Subject } from "../models/subject";
import { UseMutationResult } from "@tanstack/react-query";
import { Link } from "wouter";
import { TruncatedText } from "@/shared/components/ui/truncated-text";
import { DeleteButtonWithConfirm } from "@/shared/components/ui/delete-button-with-confirm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export function createSubjectColumns(
  careerId?: string,
  deleteSubjectMutation?: UseMutationResult<void, Error, string>
): ColumnDef<Subject>[] {
  return [
    {
      accessorKey: "name",
      header: "Asignatura",
      size: 200,
      cell: ({ row }) => {
        const subject = row.original;
        return (
          <TruncatedText text={subject.name} maxLength={25} className="font-medium text-sm" />
        );
      },
    },
    {
      accessorKey: "year",
      header: "Año",
      size: 80,
      cell: ({ row }) => {
        const year = row.original.year;
        const yearLabels = {
          First: "1er Año",
          Second: "2do Año",
          Third: "3er Año",
        };
        
        return (
          <Badge variant="outline" className="text-xs">
            {yearLabels[year as keyof typeof yearLabels] || year}
          </Badge>
        );
      },
    },
    {
      accessorKey: "professorName",
      header: "Profesor",
      size: 150,
      cell: ({ row }) => {
        const professor = row.original.professorName;
        return professor ? (
          <TruncatedText text={professor} maxLength={20} className="text-xs" />
        ) : (
          <span className="text-xs text-muted-foreground">Sin asignar</span>
        );
      },
    },
    {
      accessorKey: "enrolledStudents",
      header: "Estudiantes",
      size: 100,
      cell: ({ row }) => {
        const studentsCount = row.original.enrolledStudents?.length || 0;
        return (
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs">{studentsCount}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      size: 100,
      cell: ({ row }) => {
        const subject = row.original;
        
        return (
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    asChild
                  >
                    <Link href={`/carreras/${careerId}/asignaturas/${subject.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ver</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {deleteSubjectMutation && (
              <DeleteButtonWithConfirm
                title="¿Estás seguro?"
                description={`Esta acción no se puede deshacer. ¿Desea eliminar la asignatura "${subject.name}"?`}
                confirmText="Confirmar"
                cancelText="Cancelar"
                onConfirm={() => deleteSubjectMutation.mutate(subject.id)}
                disabled={deleteSubjectMutation.isPending}
              />
            )}
          </div>
        );
      },
    },
  ];
}
