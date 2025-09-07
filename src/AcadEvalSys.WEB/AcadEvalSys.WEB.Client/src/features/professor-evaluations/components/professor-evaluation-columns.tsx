import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Link } from "wouter";
import { Clock, CheckCircle, Eye } from "lucide-react";
import { ProfessorAssignment } from "../models";

export const professorEvaluationColumns: ColumnDef<ProfessorAssignment>[] = [
  {
    accessorKey: "competencyName",
    header: "Competencia",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("competencyName")}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.subjectName}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "careerName",
    header: "Carrera",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("careerName")}</div>
        <div className="text-sm text-muted-foreground">
          {row.original.careerYear}° Año
        </div>
      </div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Fecha Límite",
    cell: ({ row }) => {
      const dueDate = new Date(row.getValue("dueDate"));
      const isOverdue = dueDate < new Date();
      return (
        <div className={isOverdue ? "text-destructive" : ""}>
          {dueDate.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const isCompleted = status === "Completed";
      const isExpired = status === "Expired";

      return (
        <Badge
          variant={
            isCompleted ? "default" : isExpired ? "destructive" : "secondary"
          }
          className={
            isCompleted
              ? "bg-green-100 text-green-800"
              : isExpired
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }
        >
          {isCompleted ? (
            <CheckCircle className="w-3 h-3 mr-1" />
          ) : (
            <Clock className="w-3 h-3 mr-1" />
          )}
          {isCompleted ? "Completada" : isExpired ? "Vencida" : "Pendiente"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/profesor/evaluaciones/${row.original.id}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Ver Detalle
          </Button>
        </Link>
      </div>
    ),
  },
];
