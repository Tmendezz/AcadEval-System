import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Users, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { navigate } from "wouter/use-browser-location";

import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { UseMutationResult } from "@tanstack/react-query";
import {Subject} from "@features/careers";

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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleView}
            >
              <Eye className="h-4 w-4" />
              Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <ConfirmDialog
              title="¿Eliminar Asignatura?"
              description={`¿Estás seguro de que quieres eliminar "${subject.name}"? Esta acción no se puede deshacer.`}
              onConfirm={handleDelete}
              trigger={
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  disabled={deleteSubjectMutation?.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              }
            />
          </div>
        );
      },
    },
  ];
};
