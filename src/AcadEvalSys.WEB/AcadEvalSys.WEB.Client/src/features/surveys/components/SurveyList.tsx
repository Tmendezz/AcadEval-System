import { memo, useMemo } from 'react';
import { DataSection } from '@/shared/components/ui/data-section';
import { SurveyListItem } from '../services/survey-service';
import { createSurveyColumns } from './columns/survey-columns';

interface SurveyListProps {
  surveys: SurveyListItem[];
  isLoading: boolean;
  error?: Error | null;
  onEdit?: (survey: SurveyListItem) => void;
  onDelete?: (survey: SurveyListItem) => void;
  onViewProgress?: (survey: SurveyListItem) => void;
  onViewResults?: (survey: SurveyListItem) => void;
}

export const SurveyList = memo(function SurveyList({ 
  surveys, 
  isLoading, 
  error: _error,
  onEdit,
  onDelete,
  onViewProgress,
  onViewResults
}: SurveyListProps) {
  const columns = useMemo(
    () =>
      createSurveyColumns({
        onEdit,
        onDelete,
        onViewProgress,
        onViewResults,
      }),
    [onEdit, onDelete, onViewProgress, onViewResults]
  );

  return (
    <DataSection
      data={surveys}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No hay encuestas disponibles"
    />
  );
});
