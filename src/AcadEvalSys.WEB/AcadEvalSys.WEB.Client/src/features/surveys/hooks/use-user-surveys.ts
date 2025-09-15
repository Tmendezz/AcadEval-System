import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SurveyStatus } from '../models/survey-types';
import { surveyService } from '../services/survey-service';

// Tipo para las encuestas del usuario
export interface UserSurvey {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  publishedAt: string;
  closedAt?: string;
  responded: boolean;
  respondedAt?: string;
  questionsCount: number;
}

// Tipo para los filtros
export interface UserSurveyFilters {
  status?: 'pending' | 'completed' | 'all';
}

// Función para obtener las encuestas del usuario
async function fetchUserSurveys(filters?: UserSurveyFilters): Promise<UserSurvey[]> {
  try {
    // Usar el servicio real
    const surveys = await surveyService.getUserSurveys(filters);
    return surveys;
  } catch (error) {
    console.error('Error fetching user surveys:', error);
    
    // Fallback a datos de ejemplo si la API falla
    const mockSurveys: UserSurvey[] = [
      {
        id: '1',
        title: 'Evaluación de Docentes - Primer Cuatrimestre',
        description: 'Encuesta para evaluar el desempeño de los docentes del primer cuatrimestre',
        status: SurveyStatus.Published,
        publishedAt: '2024-01-15T10:00:00Z',
        closedAt: '2024-02-15T23:59:59Z',
        responded: false,
        questionsCount: 15
      },
      {
        id: '2',
        title: 'Satisfacción con la Infraestructura',
        description: 'Encuesta sobre la satisfacción con las instalaciones y servicios',
        status: SurveyStatus.Published,
        publishedAt: '2024-01-20T09:00:00Z',
        responded: true,
        respondedAt: '2024-01-22T14:30:00Z',
        questionsCount: 8
      },
      {
        id: '3',
        title: 'Evaluación de Materias Electivas',
        description: 'Encuesta sobre las materias electivas disponibles',
        status: SurveyStatus.Closed,
        publishedAt: '2024-01-10T08:00:00Z',
        closedAt: '2024-01-25T23:59:59Z',
        responded: true,
        respondedAt: '2024-01-12T16:45:00Z',
        questionsCount: 12
      },
      {
        id: '4',
        title: 'Evaluación de Servicios de Biblioteca',
        description: 'Encuesta sobre los servicios y recursos de la biblioteca',
        status: SurveyStatus.Published,
        publishedAt: '2024-01-25T11:00:00Z',
        responded: false,
        questionsCount: 10
      },
      {
        id: '5',
        title: 'Satisfacción con el Campus Virtual',
        description: 'Encuesta sobre la plataforma de aprendizaje virtual',
        status: SurveyStatus.Scheduled,
        publishedAt: '2024-02-01T09:00:00Z',
        responded: false,
        questionsCount: 6
      }
    ];

    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Aplicar filtros
    let filteredSurveys = mockSurveys;

    if (filters?.status === 'pending') {
      filteredSurveys = mockSurveys.filter(survey => 
        survey.status === SurveyStatus.Published && !survey.responded
      );
    } else if (filters?.status === 'completed') {
      filteredSurveys = mockSurveys.filter(survey => 
        survey.responded
      );
    }

    return filteredSurveys;
  }
}

// Hook para obtener las encuestas del usuario
export function useUserSurveys(filters?: UserSurveyFilters) {
  return useQuery({
    queryKey: ['user-surveys', filters],
    queryFn: () => fetchUserSurveys(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Hook específico para encuestas pendientes
export function usePendingSurveys() {
  return useUserSurveys({ status: 'pending' });
}

// Hook específico para encuestas completadas
export function useCompletedSurveys() {
  return useUserSurveys({ status: 'completed' });
}

// Hook para obtener una encuesta específica para responder
export function useSurveyForResponse(surveyId: string) {
  return useQuery({
    queryKey: ['survey-for-response', surveyId],
    queryFn: () => surveyService.getSurveyForResponse(surveyId),
    enabled: !!surveyId,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

// Hook para obtener la respuesta del usuario a una encuesta
export function useUserSurveyResponse(surveyId: string) {
  return useQuery({
    queryKey: ['user-survey-response', surveyId],
    queryFn: () => surveyService.getUserSurveyResponse(surveyId),
    enabled: !!surveyId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// Hook para enviar respuesta de encuesta
export function useSubmitSurveyResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ surveyId, responses }: { surveyId: string; responses: any[] }) =>
      surveyService.submitSurveyResponse(surveyId, responses),
    onSuccess: (_, { surveyId }) => {
      // Invalidar las queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['user-surveys'] });
      queryClient.invalidateQueries({ queryKey: ['survey-for-response', surveyId] });
      queryClient.invalidateQueries({ queryKey: ['user-survey-response', surveyId] });
    },
  });
}