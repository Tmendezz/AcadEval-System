import { useQuery } from "@tanstack/react-query";
import { studentEvaluationsApi } from "../services";
import { StudentEvaluationInstance } from "../models";

export function useEvaluationInstances() {
  return useQuery<StudentEvaluationInstance[], Error>({
    queryKey: ["student-evaluation-instances"],
    queryFn: () => studentEvaluationsApi.getEvaluationInstances(),
  });
}
