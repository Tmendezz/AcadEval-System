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
function getResponseStatusBadge(isCompleted: boolean) {
  if (isCompleted) {
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
    accessorKey: 'isCompleted',
    header: 'Estado',
    cell: ({ row }) => getResponseStatusBadge(row.original.isCompleted),
  },
  {
    accessorKey: 'closeAt',
    header: 'Cierre',
    cell: ({ row }) => {
      const closeAt = row.original.closeAt;
      if (!closeAt) return <span className="text-muted-foreground">—</span>;
      const d = new Date(closeAt);
      if (isNaN(d.getTime())) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-3 h-3" />
          {d.toLocaleDateString('es-ES')}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const { surveyId, isCompleted, closeAt } = row.original as any;
      const isExpired = closeAt ? new Date(closeAt).getTime() < Date.now() : false;
      if (!isCompleted && !isExpired) {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRespond(surveyId)}
            >
              <Eye className="h-4 w-4" />
              Responder
            </Button>
          </div>
        );
      }
      return <span className="text-muted-foreground text-sm">No disponible</span>;
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
    accessorKey: 'submittedAt',
    header: 'Respondida',
    cell: ({ row }) => {
      if (!row.original.isCompleted || !row.original.submittedAt) {
        return <span className="text-muted-foreground">—</span>;
      }
      return (
        <div className="flex items-center gap-1 text-sm">
          {new Date(row.original.submittedAt).toLocaleDateString('es-ES')}
        </div>
      );
    },
  },
  {
    accessorKey: 'closeAt',
    header: 'Cierre',
    cell: ({ row }) => {
      const closeAt = row.original.closeAt;
      if (!closeAt) return <span className="text-muted-foreground">—</span>;
      const d = new Date(closeAt);
      if (isNaN(d.getTime())) return <span className="text-muted-foreground">—</span>;
      return (
        <div className="flex items-center gap-1 text-sm">
          <Calendar className="w-3 h-3" />
          {d.toLocaleDateString('es-ES')}
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
