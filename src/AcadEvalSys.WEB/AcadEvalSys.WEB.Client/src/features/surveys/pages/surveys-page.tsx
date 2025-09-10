import { useState } from 'react';
import { useLocation } from 'wouter';
import { SurveyListItem, SurveyStatus } from '../models/survey-types';
import { useSurveys } from '../hooks/use-surveys';
import { SurveyList } from '../components/SurveyList';
import { Button } from '@/shared/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';

export default function SurveysPage() {
  const [filters, setFilters] = useState({
    status: undefined as SurveyStatus | undefined,
    search: '',
  });

  const [, setLocation] = useLocation();

  const { data: surveys = [], isLoading, error } = useSurveys(filters);


  const handleCreateSurvey = () => {
    setLocation('/encuestas/crear');
  };

  const handleEditSurvey = (survey: SurveyListItem) => {
    setLocation(`/encuestas/editar/${survey.id}`);
  };

  const handleStatusFilterChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      status: value === 'all' ? undefined : Number(value) as SurveyStatus,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
    }));
  };

  return (
    <PageLayout>
      <PageHeader
        title="Encuestas"
        description="Gestiona tus encuestas académicas"
      >
        <Button onClick={handleCreateSurvey}>
          <Plus className="w-4 h-4 mr-2" />
          Crear Encuesta
        </Button>
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