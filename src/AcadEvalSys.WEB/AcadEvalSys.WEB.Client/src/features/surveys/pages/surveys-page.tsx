import { useState } from 'react';
import { useLocation } from 'wouter';
import { SurveyStatus } from '../models/survey-types';
import { SurveyListItem } from '..';
import { useSurveys } from '../hooks/use-surveys';
import { SurveyList } from '../components/SurveyList';

import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';

export default function SurveysPage() {
  const [filters] = useState({
    status: undefined as SurveyStatus | undefined,
    search: '',
  });

  const [, setLocation] = useLocation();

  const { data: surveys = [], isLoading, error } = useSurveys(filters);



  const handleEditSurvey = (survey: SurveyListItem) => {
    setLocation(`/encuestas/editar/${survey.id}`);
  };

  return (
    <PageLayout>
      <PageHeader
        title="Encuestas"
        description="Gestiona tus encuestas académicas"
      >
        
      </PageHeader>
      <PageContent> 

      <SurveyList
        surveys={surveys}
        isLoading={isLoading}
        error={error}
        onEdit={handleEditSurvey}
      />
    </PageContent>
    </PageLayout>
  );
}