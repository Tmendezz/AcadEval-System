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
    accessorKey: "periodTo",
    header: "Fecha Límite",
    cell: ({ row }) => {
      const raw = row.original.periodTo ?? row.original.periodFrom;
      if (!raw) return <div className="text-muted-foreground">Sin fecha</div>;
      const dueDate = new Date(raw);
      const isInvalid = isNaN(dueDate.getTime());
      const isOverdue = !isInvalid && dueDate < new Date();
      return (
        <div className={isOverdue ? "text-destructive" : ""}>
          {isInvalid ? "Fecha inválida" : dueDate.toLocaleDateString()}
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

      return (
        <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
          {isCompleted ? (
            <CheckCircle className="w-3 h-3 mr-1" />
          ) : (
            <Clock className="w-3 h-3 mr-1" />
          )}
          {isCompleted ? "Completada" : "Pendiente"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link href={`/profesor/evaluaciones/${row.original.assignmentId}`}>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="w-4 h-4" />
            Ver Detalle
          </Button>
        </Link>
      </div>
    ),
  },
];
