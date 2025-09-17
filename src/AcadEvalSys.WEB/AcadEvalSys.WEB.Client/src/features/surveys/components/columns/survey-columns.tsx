import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Edit, Trash2, BarChart } from 'lucide-react';
import { SurveyListItem } from '../../models/survey-types';
import { getSurveyStatusLabel } from '../../utils/survey-formatters';

function getStatusVariant(status: number) {
  switch (status) {
    case 0:
      return 'secondary'; // Draft
    case 1:
      return 'outline'; // Scheduled
    case 2:
      return 'default'; // Published
    case 3:
      return 'destructive'; // Closed
    case 4:
      return 'outline'; // Archived
    default:
      return 'secondary';
  }
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export interface SurveyColumnsDeps {
  onEdit?: (survey: SurveyListItem) => void;
  onDelete?: (survey: SurveyListItem) => void;
  onViewProgress?: (survey: SurveyListItem) => void;
}

export function createSurveyColumns({
  onEdit,
  onDelete,
  onViewProgress,
}: SurveyColumnsDeps): ColumnDef<SurveyListItem>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Título',
      cell: ({ row }) => <span className="font-medium line-clamp-2">{row.original.title}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {getSurveyStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: 'publishedAt',
      header: 'Publicada',
      cell: ({ row }) => (row.original.publishedAt ? formatDate(row.original.publishedAt) : '—'),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const survey = row.original;
        console.log('Survey data in actions column:', survey);
        const isPublished = survey.status === 2;
        const isClosed = survey.status === 3;
        const isDraft = survey.status === 0;
        const isScheduled = survey.status === 1;
        
        // Se puede eliminar solo si NO está activa (borrador o programada)
        const canDelete = isDraft || isScheduled;
        // Se puede ver progreso solo si está publicada o cerrada
        const canViewProgress = isPublished || isClosed;
        
        return (
          <div className="flex items-center gap-2">
            {/* Botón Editar - siempre disponible */}
            {onEdit && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onEdit(survey)}
                className="h-8 px-2 text-xs"
              >
                <Edit className="w-3 h-3 mr-1" />
                Editar
              </Button>
            )}
            
            {/* Botón Ver Progreso/Resultados - solo si está activa */}
            {canViewProgress && onViewProgress && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onViewProgress(survey)}
                className="h-8 px-2 text-xs"
              >
                <BarChart className="w-3 h-3 mr-1" />
                {isClosed ? 'Resultados' : 'Progreso'}
              </Button>
            )}
            
            {/* Botón Eliminar - solo si NO está activa */}
            {canDelete && onDelete && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onDelete(survey)}
                className="h-8 px-2 text-xs text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Eliminar
              </Button>
            )}
          </div>
        );
      },
    },
  ];
}


