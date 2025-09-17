import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Edit, Trash2, BarChart } from 'lucide-react';
import { SurveyListItem } from '../../models/survey-types';
import { getSurveyStatusLabel } from '../../utils/survey-formatters';

function getStatusVariant(status: number | string) {
  // Convertir string a número si es necesario
  let statusNum: number;
  if (typeof status === 'string') {
    switch (status) {
      case 'Draft': statusNum = 0; break;
      case 'Scheduled': statusNum = 1; break;
      case 'Published': statusNum = 2; break;
      case 'Closed': statusNum = 3; break;
      case 'Archived': statusNum = 4; break;
      default: statusNum = 0;
    }
  } else {
    statusNum = Number(status);
  }

  switch (statusNum) {
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

function getStatusNumber(status: number | string): number {
  if (typeof status === 'string') {
    switch (status) {
      case 'Draft': return 0;
      case 'Scheduled': return 1;
      case 'Published': return 2;
      case 'Closed': return 3;
      case 'Archived': return 4;
      default: return 0;
    }
  }
  return Number(status);
}

export interface SurveyColumnsDeps {
  onEdit?: (survey: SurveyListItem) => void;
  onDelete?: (survey: SurveyListItem) => void;
  onViewProgress?: (survey: SurveyListItem) => void;
  onViewResults?: (survey: SurveyListItem) => void;
}

export function createSurveyColumns({
  onEdit,
  onDelete,
  onViewProgress,
  onViewResults,
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
      accessorKey: 'publishAt',
      header: 'Publicada',
      cell: ({ row }) => (row.original.publishAt ? formatDate(row.original.publishAt) : '—'),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const survey = row.original;
        const statusNum = getStatusNumber(survey.status);
        const isPublished = statusNum === 2;
        const isClosed = statusNum === 3;
        const isDraft = statusNum === 0;
        const isScheduled = statusNum === 1;
        
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
            
                    {/* Botón Ver Progreso - solo si está publicada */}
                    {isPublished && onViewProgress && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onViewProgress(survey)}
                        className="h-8 px-2 text-xs"
                      >
                        <BarChart className="w-3 h-3 mr-1" />
                        Progreso
                      </Button>
                    )}
                    
                    {/* Botón Ver Resultados - solo si está cerrada */}
                    {isClosed && onViewResults && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onViewResults(survey)}
                        className="h-8 px-2 text-xs"
                      >
                        <BarChart className="w-3 h-3 mr-1" />
                        Resultados
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


