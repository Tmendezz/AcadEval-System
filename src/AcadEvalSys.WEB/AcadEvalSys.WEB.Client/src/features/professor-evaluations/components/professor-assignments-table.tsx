import { DataTable } from "@/shared/components/data-table/data-table";
import type { ProfessorEvaluationAssignment } from "@/features/professor-evaluations/models/professor-evaluation";
import { professorAssignmentsColumns } from "@/features/professor-evaluations/columns/professor-assignments-columns";

interface Props {
  data: ProfessorEvaluationAssignment[];
}

export function ProfessorAssignmentsTable({ data }: Props) {
  return <DataTable columns={professorAssignmentsColumns} data={data} />;
}

export default ProfessorAssignmentsTable;


