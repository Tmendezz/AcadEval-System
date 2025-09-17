import { useState } from 'react';
import { useLocation } from 'wouter';
import { PageContent, PageHeader, PageLayout } from '@/shared/components/layout/page-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { DataTable } from '@/shared/components/data-table/data-table';
import { CheckCircle, Clock } from 'lucide-react';
import { usePendingSurveys, useCompletedSurveys, UserSurveyDto } from '../hooks/use-surveys';
import { createPendingSurveyColumns, createCompletedSurveyColumns } from '../components/survey-table-columns';

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

  const pendingColumns = createPendingSurveyColumns(handleRespond);
  const completedColumns = createCompletedSurveyColumns();

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
           
              
              {isLoadingPending ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Cargando encuestas pendientes...</p>
                </div>
              ) : sortedPendingSurveys.length > 0 ? (
                <DataTable 
                  columns={pendingColumns} 
                  data={sortedPendingSurveys}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No hay encuestas pendientes</p>
                  <p className="text-sm">Todas tus encuestas asignadas han sido completadas</p>
                </div>
              )}
            
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
           
              
              {isLoadingCompleted ? (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Cargando encuestas completadas...</p>
                </div>
              ) : sortedCompletedSurveys.length > 0 ? (
                  <DataTable 
                    columns={completedColumns} 
                    data={sortedCompletedSurveys}
                  />  
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No hay encuestas completadas</p>
                  <p className="text-sm">Las encuestas que respondas aparecerán aquí</p>
                </div>
              )}
            
          </TabsContent>
        </Tabs>
      </PageContent>
    </PageLayout>
  );
}