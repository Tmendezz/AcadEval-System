import { useParams } from "wouter";
import { useCompetencyById } from "@/shared/hooks/use-competencies";

export const useCompetencyDetail = () => {
  const params = useParams();
  const id = params.id;

  return useCompetencyById(id || "");
};
