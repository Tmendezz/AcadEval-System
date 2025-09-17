import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Eye, CheckCircle, Clock, Calendar } from 'lucide-react';
import { SurveyStatus } from '../models/survey-types';
import { UserSurveyDto } from '../hooks/use-surveys';

// Función para obtener el estado de la encuesta
function getSurveyStatusBadge(status: SurveyStatus) {
  switch (status) {
    case SurveyStatus.Published:
      return <Badge variant="default">Publicada</Badge>;
    case SurveyStatus.Closed:
      return <Badge variant="destructive">Cerrada</Badge>;
    case SurveyStatus.Scheduled:
      return <Badge variant="outline">Programada</Badge>;
    default:
      return <Badge variant="secondary">Borrador</Badge>;
  }
}

// Función para obtener el estado de respuesta
function getResponseStatusBadge(responded: boolean) {
  if (responded) {
    return (
      <Badge variant="default" className="flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Completada
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Clock className="w-3 h-3" />
      Pendiente
    </Badge>
  );
}

// Columnas para la tabla de encuestas pendientes
export const createPendingSurveyColumns = (
  onRespond: (surveySubjectId: string) => void
): ColumnDef<UserSurveyDto>[] => [
  {
    accessorKey: 'title',
    header: 'Título',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{row.original.title}</div>
        <div className="text-sm text-muted-foreground line-clamp-2">
          {row.original.description}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Estado',
    cell: ({ row }) => getSurveyStatusBadge(row.original.status),
  },
  {
    accessorKey: 'responded',
    header: 'Mi Estado',
    cell: ({ row }) => getResponseStatusBadge(row.original.responded),
  },
  {
    accessorKey: 'questionsCount',
    header: 'Preguntas',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.questionsCount} preguntas
      </span>
    ),
  },
  {
    accessorKey: 'publishedAt',
    header: 'Publicada',
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Calendar className="w-3 h-3" />
        {new Date(row.original.publishedAt).toLocaleDateString('es-ES')}
      </div>
    ),
  },
  {
    accessorKey: 'respondedAt',
    header: 'Respondida',
    cell: ({ row }) => {
      if (!row.original.responded || !row.original.respondedAt) {
        return <span className="text-muted-foreground">—</span>;
      }
      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-3 h-3" />
          {new Date(row.original.respondedAt).toLocaleDateString('es-ES')}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const { surveySubjectId, status, responded } = row.original;
      
      // Encuesta pendiente y publicada
      if (status === SurveyStatus.Published && !responded) {
        return (
          <Button size="sm" onClick={() => onRespond(surveySubjectId)}>
            Responder
          </Button>
        );
      }
      
      // Encuesta cerrada o no disponible
      return (
        <span className="text-muted-foreground text-sm">
          {status === SurveyStatus.Closed ? 'Cerrada' : 'No disponible'}
        </span>
      );
    },
  },
];

// Columnas simplificadas para la tabla de encuestas completadas
export const createCompletedSurveyColumns = (): ColumnDef<UserSurveyDto>[] => [
  {
    accessorKey: 'title',
    header: 'Título',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium truncate max-w-xs">{row.original.title}</div>
        <div className="text-sm text-muted-foreground line-clamp-2">
          {row.original.description}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'publishedAt',
    header: 'Publicada',
    cell: ({ row }) => (
      <div className="flex items-center gap-1 text-sm">
        <Calendar className="w-3 h-3" />
        {new Date(row.original.publishedAt).toLocaleDateString('es-ES')}
      </div>
    ),
  },
  {
    accessorKey: 'respondedAt',
    header: 'Respondida',
    cell: ({ row }) => {
      if (!row.original.responded || !row.original.respondedAt) {
        return <span className="text-muted-foreground">—</span>;
      }
      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-3 h-3" />
          {new Date(row.original.respondedAt).toLocaleDateString('es-ES')}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: () => {
      return (
        <Button variant="outline" size="sm" disabled>
          <Eye className="w-4 h-4 mr-1" />
          Ver Respuesta
        </Button>
      );
    },
  },
];
