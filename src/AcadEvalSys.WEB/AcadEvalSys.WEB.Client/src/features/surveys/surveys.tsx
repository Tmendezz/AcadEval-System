import {
  PageLayout,
  PageHeader,
  PageContent,
} from "@/shared/components/layout/page-layout";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useGetSurveys } from "./hooks/use-get-surveys";
import { SurveyList } from "./components/SurveyList";

export default function Surveys() {
  const { data: surveysData, isLoading } = useGetSurveys();
  const surveys = surveysData?.items || [];

  return (
    <PageLayout>
      <PageHeader
        title="Gestión de Encuestas"
        description="Crea, gestiona y analiza encuestas académicas"
      >
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Encuesta
        </Button>
      </PageHeader>

      <PageContent>
        <SurveyList surveys={surveys} isLoading={isLoading} />
      </PageContent>
    </PageLayout>
  );
}
