import { useParams } from "wouter";
import { useCompetencyById } from "@/shared/hooks/use-competencies";
import { CompetencyDetailLayout } from "./components/competency-detail-layout";

export default function CompetencyDetail() {
  const params = useParams();
  const id = params.id;
  const { data: competency, isLoading, error } = useCompetencyById(id || "");

  return (
    <CompetencyDetailLayout
      competency={competency}
      isLoading={isLoading}
      error={error}
    />
  );
}
