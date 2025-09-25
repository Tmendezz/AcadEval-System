import { useParams } from "wouter";
import { useCompetencyById } from "@/features/competencies/hooks/use-competencies";

export const useCompetencyDetail = () => {
  const params = useParams();
  const id = params.id;

  return useCompetencyById(id || "");
};
