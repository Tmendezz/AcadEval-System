import { useState } from 'react';
import { useLocation } from 'wouter';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { DataTable } from '@/shared/components/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, CheckCircle, Clock, Calendar } from 'lucide-react';
import { SurveyStatus } from '../models/survey-types';
import { usePendingSurveys, useCompletedSurveys, UserSurveyDto } from '../hooks/use-surveys';

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

// Columnas para la tabla de encuestas
const createSurveyColumns = (onRespond: (surveySubjectId: string) => void, onView: (surveySubjectId: string) => void): ColumnDef<UserSurveyDto>[] => [
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
      
      // Encuesta completada
      if (responded) {
        return (
          <Button variant="outline" size="sm" onClick={() => onView(surveySubjectId)}>
            <Eye className="w-4 h-4 mr-1" />
            Ver Respuesta
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

export default function MySurveysPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');

  // Obtener datos de las encuestas
  const { data: pendingSurveys = [], isLoading: isLoadingPending } = usePendingSurveys();
  const { data: completedSurveys = [], isLoading: isLoadingCompleted } = useCompletedSurveys();

  // Ordenar por fecha de publicación (más recientes primero)
  const sortByPublishedDate = (a: UserSurveyDto, b: UserSurveyDto) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

  const sortedPendingSurveys = [...pendingSurveys].sort(sortByPublishedDate);
  const sortedCompletedSurveys = [...completedSurveys].sort(sortByPublishedDate);

  const handleRespond = (surveySubjectId: string) => {
    setLocation(`/encuestas/responder/${surveySubjectId}`);
  };

  const handleView = (surveySubjectId: string) => {
    setLocation(`/encuestas/ver-respuesta/${surveySubjectId}`);
  };

  const columns = createSurveyColumns(handleRespond, handleView);

  return (
    <PageLayout>
      <PageHeader 
        title="Mis Encuestas" 
        description="Gestiona las encuestas que tienes asignadas para responder"
      />
      <PageContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'pending' | 'completed')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pendientes
              <Badge variant="secondary" className="ml-1">
                {pendingSurveys.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completadas
              <Badge variant="secondary" className="ml-1">
                {completedSurveys.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Encuestas Pendientes</h3>
                  <p className="text-sm text-muted-foreground">
                    Encuestas habilitadas que aún no has respondido
                  </p>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {pendingSurveys.length} pendientes
                </Badge>
              </div>
              
              {isLoadingPending ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Cargando encuestas pendientes...</p>
                </div>
              ) : sortedPendingSurveys.length > 0 ? (
                <DataTable 
                  columns={columns} 
                  data={sortedPendingSurveys}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No hay encuestas pendientes</p>
                  <p className="text-sm">Todas tus encuestas asignadas han sido completadas</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Encuestas Completadas</h3>
                  <p className="text-sm text-muted-foreground">
                    Encuestas que ya has respondido
                  </p>
                </div>
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {completedSurveys.length} completadas
                </Badge>
              </div>
              
              {isLoadingCompleted ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Cargando encuestas completadas...</p>
                </div>
              ) : sortedCompletedSurveys.length > 0 ? (
                  <DataTable 
                    columns={columns} 
                    data={sortedCompletedSurveys}
                  />  
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No hay encuestas completadas</p>
                  <p className="text-sm">Las encuestas que respondas aparecerán aquí</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PageContent>
    </PageLayout>
  );
}