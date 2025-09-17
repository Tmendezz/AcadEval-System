import { DataSection } from '@/shared/components/ui/data-section';
import { SurveyListItem } from '../models/survey-types';
import { createSurveyColumns } from './columns/survey-columns';

interface SurveyListProps {
  surveys: SurveyListItem[];
  isLoading: boolean;
  error?: Error | null;
  onEdit?: (survey: SurveyListItem) => void;
  onDelete?: (survey: SurveyListItem) => void;
  onViewProgress?: (survey: SurveyListItem) => void;
}

export function SurveyList({ 
  surveys, 
  isLoading, 
  error: _error,
  onEdit,
  onDelete,
  onViewProgress
}: SurveyListProps) {
  const columns = createSurveyColumns({ 
    onEdit, 
    onDelete, 
    onViewProgress 
  });

  return (
    <DataSection
      data={surveys}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No hay encuestas disponibles"
    />
  );
}
