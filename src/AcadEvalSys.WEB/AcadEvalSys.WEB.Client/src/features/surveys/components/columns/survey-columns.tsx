import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Edit, BarChart, Send } from 'lucide-react';
import { SurveyListItem } from '../../models/survey-types';
import { getSurveyStatusLabel } from '../../utils/survey-formatters';
import { TruncatedText } from '@/shared/components/ui/truncated-text';
import { DeleteButtonWithConfirm } from '@/shared/components/ui/delete-button-with-confirm';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';

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
  onPublish?: (survey: SurveyListItem) => void;
}

export function createSurveyColumns({
  onEdit,
  onDelete,
  onViewProgress,
  onViewResults,
  onPublish,
}: SurveyColumnsDeps): ColumnDef<SurveyListItem>[] {
  return [
    {
      accessorKey: 'title',
      header: 'Título',
      size: 200,
      cell: ({ row }) => (
        <TruncatedText text={row.original.title} maxLength={30} className="font-medium text-xs" />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      size: 100,
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)} className="text-xs">
          {getSurveyStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: 'publishAt',
      header: 'Visible desde',
      size: 100,
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.publishAt ? formatDate(row.original.publishAt) : '—'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      size: 120,
      cell: ({ row }) => {
        const survey = row.original;
        const statusNum = getStatusNumber(survey.status);
        const isPublished = statusNum === 2;
        const isClosed = statusNum === 3;
        const isDraft = statusNum === 0;
        const isScheduled = statusNum === 1;
        
        // Se puede editar solo si NO está publicada (borrador o programada)
        const canEdit = isDraft || isScheduled;
        // Se puede eliminar solo si NO está activa (borrador o programada)
        const canDelete = isDraft || isScheduled;
        // Se puede ver progreso solo si está publicada o cerrada
        const canViewProgress = isPublished || isClosed;
        // Se puede publicar solo si está en borrador o programada
        const canPublish = isDraft || isScheduled;
        
        return (
          <div className="flex items-center gap-1">
            <TooltipProvider>
              {/* Botón Publicar - solo si se puede publicar */}
              {canPublish && onPublish && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="default"
                      size="sm"
                      className="h-7 w-7 p-0"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPublish(survey);
                      }}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Publicar</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Botón Editar - solo si se puede editar */}
              {canEdit && onEdit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(survey);
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Editar</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Botón Ver Progreso - solo si está publicada */}
              {isPublished && onViewProgress && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProgress(survey);
                      }}
                    >
                      <BarChart className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Progreso</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Botón Ver Resultados - solo si está cerrada */}
              {isClosed && onViewResults && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewResults(survey);
                      }}
                    >
                      <BarChart className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Resultados</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Botón Eliminar - solo si se puede eliminar */}
              {canDelete && onDelete && (
                <DeleteButtonWithConfirm
                  title="¿Estás seguro?"
                  description={`Esta acción no se puede deshacer. ¿Desea eliminar la encuesta "${survey.title}"?`}
                  confirmText="Confirmar"
                  cancelText="Cancelar"
                  onConfirm={() => onDelete(survey)}
                />
              )}
            </TooltipProvider>
          </div>
        );
      },
    },
  ];
}
