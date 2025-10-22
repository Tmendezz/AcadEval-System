import type { ColumnDef } from "@tanstack/react-table";
import type { ProfessorEvaluationAssignment } from "@/features/professor-evaluations/models/professor-evaluation";
import { Button } from "@/shared/components/ui/button";
import { Link } from "wouter";
import { Eye } from "lucide-react";

export const professorAssignmentsColumns: ColumnDef<ProfessorEvaluationAssignment>[] = [
  {
    accessorKey: "competencyName",
    header: "Competencia",
  },
  { accessorKey: "subjectName", header: "Asignatura" },
  { accessorKey: "careerName", header: "Carrera" },
  { accessorKey: "careerYear", header: "Año" },
  { accessorKey: "status", header: "Estado" },
  {
    accessorKey: "periodTo",
    header: "Fecha de finalización",
    cell: ({ row }) =>
      row.original && (row.original as any).periodTo
        ? new Date((row.original as any).periodTo as string).toLocaleDateString()
        : "-",
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          asChild
        >
          <Link href={`/profesor/evaluaciones/${row.original.assignmentId}`}>
            <Eye className="h-4 w-4" />
            Evaluar
          </Link>
        </Button>
      </div>
    ),
  },
];
