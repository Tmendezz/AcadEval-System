"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { navigate } from "wouter/use-browser-location";
import { format } from "date-fns";
import { ProfessorAssignment } from "@/features/professor-evaluations/models/professor-evaluation";

export const professorEvaluationColumns: ColumnDef<ProfessorAssignment>[] =
  [
    {
      id: "competencyName",
      accessorKey: "competencyName",
      header: "Competencia",
      size: 180,
      minSize: 150,
      cell: ({ row }) => {
        return (
          <div className="text-sm font-medium">
            {row.original.competencyName}
          </div>
        );
      },
    },
    {
      id: "subjectName",
      accessorKey: "subjectName",
      header: "Asignatura",
      size: 180,
      minSize: 160,
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground">
            <div className="whitespace-normal break-words hyphens-auto leading-relaxed">
              {row.original.subjectName}
            </div>
          </div>
        );
      },
    },
    {
      id: "careerName",
      accessorKey: "careerName",
      header: "Tecnicatura",
      size: 200,
      minSize: 180,
      cell: ({ row }) => {
        return (
          <div className="text-sm text-muted-foreground whitespace-normal break-words hyphens-auto leading-relaxed">
            {row.original.careerName}
          </div>
        );
      },
    },
    {
      id: "period",
      header: "Período",
      size: 160,
      minSize: 140,
      cell: ({ row }) => {
        const startDate = row.original.periodFrom;
        const endDate = row.original.periodTo;

        if (!startDate && !endDate) {
          return (
            <div className="text-sm text-muted-foreground">
              <div className="text-xs text-muted-foreground/70">
                Período no configurado
              </div>
            </div>
          );
        }

        try {
          const startFormatted = startDate
            ? format(new Date(startDate), "dd/MM/yyyy")
            : "Sin fecha";
          const endFormatted = endDate
            ? format(new Date(endDate), "dd/MM/yyyy")
            : "Sin fecha";

          return (
            <div className="text-sm text-muted-foreground">
              <div className="flex flex-col gap-1">
                <div className="text-xs text-muted-foreground/70">Inicio</div>
                <div>{startFormatted}</div>
                <div className="text-xs text-muted-foreground/70 mt-2">Fin</div>
                <div>{endFormatted}</div>
              </div>
            </div>
          );
        } catch {
          return (
            <div className="text-sm text-muted-foreground">
              Fechas inválidas
            </div>
          );
        }
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
      id: "progress",
      header: "Progreso",
      size: 180,
      minSize: 160,
      cell: ({ row }) => {
        const {
          totalStudentsCount,
          evaluatedStudentsCount,
          progressPercentage,
        } = row.original;
        return (
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>
                  {evaluatedStudentsCount}/{totalStudentsCount} estudiantes
                </span>
                <span>{progressPercentage}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Acciones",
      size: 140,
      minSize: 120,
      cell: ({ row }) => {
        const assignment = row.original;

        const handleView = () => {
          navigate(`/evaluaciones/docentes/mis-evaluaciones/${assignment.assignmentId}`);
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
