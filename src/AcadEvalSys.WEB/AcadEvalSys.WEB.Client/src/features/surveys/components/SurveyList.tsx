import { DataSection } from '@/shared/components/ui/data-section';
import { SurveyListItem } from '../models/survey-types';
import { createSurveyColumns } from './columns/survey-columns';

interface SurveyListProps {
  surveys: SurveyListItem[];
  isLoading: boolean;
  error?: Error | null;
  onEdit?: (survey: SurveyListItem) => void;
  onDuplicate?: (survey: SurveyListItem) => void;
  onView?: (survey: SurveyListItem) => void;
  onArchive?: (survey: SurveyListItem) => void;
  onDelete?: (survey: SurveyListItem) => void;
}

export function SurveyList({ 
  surveys, 
  isLoading, 
  error: _error,
  onEdit,
  onDuplicate,
  onView,
  onArchive,
  onDelete
}: SurveyListProps) {
  const columns = createSurveyColumns({ onView, onEdit, onDuplicate, onArchive, onDelete });

  return (
    <DataSection
      data={surveys}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="No hay encuestas disponibles"
    />
  );
}
