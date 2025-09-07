import { Link } from "wouter";
import { Button } from "@/shared/components/ui/button";
import { DataSection } from "@/shared/components/ui/data-section";
import { surveyColumns } from "./survey-columns";
import { SurveyListItem } from "@infrastructure/api/clients/survey-service";
import { Plus } from "lucide-react";

interface SurveyListProps {
  surveys: SurveyListItem[];
  isLoading: boolean;
}

export function SurveyList({ surveys, isLoading }: SurveyListProps) {
  return (
    <DataSection
      title="Lista de Encuestas"
      description="Encuestas académicas disponibles en el sistema."
      data={surveys}
      columns={surveyColumns}
      isLoading={isLoading}
      emptyMessage="No se encontraron encuestas."
      extraHeaderContent={
        <Link href="/surveys/nueva">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Encuesta
          </Button>
        </Link>
      }
    />
  );
}
