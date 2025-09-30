"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye } from "lucide-react";
import {StudentCompetencyEvaluation} from "@features/student-evaluations/models";

export const studentEvaluationColumns: ColumnDef<StudentCompetencyEvaluation>[] =
  [
    {
      id: "studentName",
      accessorKey: "studentName",
      header: "Estudiante",
      size: 180,
      minSize: 150,
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium">
            {row.original.studentName}
          </div>
        );
      },
    },
    {
      id: "studentEmail",
      accessorKey: "studentEmail",
      header: "Email",
      size: 180,
      minSize: 160,
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground">
            <div className="whitespace-normal break-words hyphens-auto leading-relaxed">
              {row.original.studentEmail}
            </div>
          </div>
        );
      },
    },
    {
        id: "competencyLevel",
        accessorKey: "competencyLevel",
        header: "Nivel",
        size: 180,
        minSize: 160,
        cell: ({ row }) => {
          return (
            <div className="text-sm text-muted-foreground">
              <div className="whitespace-normal break-words hyphens-auto leading-relaxed">
                {row.original.competencyLevel}
              </div>
            </div>
          );
        },
      },
    {
      id: "status",
      accessorKey: "status",
      header: "Estado",
      size: 120,
      minSize: 100,
      cell: ({ row }) => {
        const status = row.original.status;
        const variant = status === "Completed" ? "outline" : "secondary";
        const label = status === "Completed" ? "Completada" : "Pendiente";

        return (
          <Badge variant={variant}>
            {label}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      size: 120,
      minSize: 100,
      cell: ({ row }) => {
        const student = row.original;

        const handleView = () => {
          // TODO: Implementar navegación a detalle del estudiante
          console.log("Ver detalle estudiante:", student.studentName);
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
          </div>
        );
      },
    },
  ];
