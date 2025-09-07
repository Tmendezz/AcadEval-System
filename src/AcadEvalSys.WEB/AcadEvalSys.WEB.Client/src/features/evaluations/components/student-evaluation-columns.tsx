"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { StudentCompetencyEvaluationFromApi } from "../types/professor-evaluation";

export const studentEvaluationColumns: ColumnDef<StudentCompetencyEvaluationFromApi>[] =
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
          <Badge
            className={`text-xs ${
              status === "Completed"
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-orange-100 text-orange-800 border-orange-200"
            }`}
            variant={variant}
          >
            {label}
          </Badge>
        );
      },
    },
  ];
