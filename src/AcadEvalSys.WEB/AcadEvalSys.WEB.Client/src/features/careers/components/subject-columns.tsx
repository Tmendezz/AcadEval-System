import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Users, Edit, Trash2, Eye } from "lucide-react";
import { Subject } from "@infrastructure/api/types/subject";
import { Button } from "@/shared/components/ui/button";
import { navigate } from "wouter/use-browser-location";

import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { UseMutationResult } from "@tanstack/react-query";

export const createSubjectColumns = (
  careerId?: string,
  deleteSubjectMutation?: UseMutationResult<
    void,
    Error,
    { careerId: string; subjectId: string },
    unknown
  >
): ColumnDef<Subject>[] => {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
    },

    {
      id: "enrolledStudents",
      header: "Estudiantes",
      cell: ({ row }) => {
        const enrolledStudents = row.original.enrolledStudents || [];
        return (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{enrolledStudents.length}</span>
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

        const handleDelete = () => {
          if (careerId && deleteSubjectMutation) {
            deleteSubjectMutation.mutate({ careerId, subjectId: subject.id });
          }
        };

        const handleView = (e: React.MouseEvent) => {
          e.stopPropagation();
          if (careerId) {
            navigate(`/carreras/${careerId}/asignaturas/${subject.id}`);
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
            <ConfirmDialog
              title="¿Eliminar Asignatura?"
              description={`¿Estás seguro de que quieres eliminar "${subject.name}"? Esta acción no se puede deshacer.`}
              onConfirm={handleDelete}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="h-7 w-7 p-0"
                  disabled={deleteSubjectMutation?.isPending}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              }
            />
          </div>
        );
      },
    },
  ];
};
