import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { surveyService } from '../services/survey-service';
import { userSurveysService, UserSurveyDto, UserSurveyFilters } from '../services/user-surveys-service';
import { CreateAcademicSurveyRequest, SurveyFilters } from '../models/survey-types';
import { api } from '@/infrastructure/query/axios';

export interface TechnicalCareer {
  id: string;
  name: string;
}

// Query keys
export const surveyKeys = {
  all: ['surveys'] as const,
  lists: () => [...surveyKeys.all, 'list'] as const,
  list: (filters?: SurveyFilters) => [...surveyKeys.lists(), { filters }] as const,
  details: () => [...surveyKeys.all, 'detail'] as const,
  detail: (id: string) => [...surveyKeys.details(), id] as const,
};

// Query keys para encuestas de usuario
export const userSurveysKeys = {
  all: ['user-surveys'] as const,
  lists: () => [...userSurveysKeys.all, 'list'] as const,
  list: (filters?: UserSurveyFilters) => [...userSurveysKeys.lists(), { filters }] as const,
};

// Hooks para obtener datos
export function useSurveys(filters?: SurveyFilters) {
  return useQuery({
    queryKey: surveyKeys.list(filters),
    queryFn: () => surveyService.getSurveys(filters),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useSurvey(id: string) {
  return useQuery({
    queryKey: surveyKeys.detail(id),
    queryFn: () => surveyService.getSurveyById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 20 * 60 * 1000,
  });
}

// Hooks para mutaciones
export function useCreateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (survey: CreateAcademicSurveyRequest) => surveyService.createSurvey(survey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
    },
  });
}

export function useUpdateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, survey }: { id: string; survey: CreateAcademicSurveyRequest }) =>
      surveyService.updateSurvey(id, survey),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(variables.id) });
    },
  });
}

export function useDeleteSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => surveyService.deleteSurvey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
    },
  });
}

export function useDuplicateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newTitle }: { id: string; newTitle: string }) =>
      surveyService.duplicateSurvey(id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
    },
  });
}

export function usePublishSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => surveyService.publishSurvey(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(id) });
    },
  });
}

export function useCloseSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => surveyService.closeSurvey(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(id) });
    },
  });
}

export function useArchiveSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => surveyService.archiveSurvey(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(id) });
    },
  });
}

// Hook para obtener tecnicaturas
export function useTechnicalCareers() {
  return useQuery({
    queryKey: ['technical-careers'],
    queryFn: async (): Promise<TechnicalCareer[]> => {
      const response = await api.get('/technical-careers');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
}

// Hook para obtener respuestas de encuesta (admin)
export function useSurveyResponses(surveyId: string) {
  return useQuery({
    queryKey: ['survey-responses', surveyId],
    queryFn: () => surveyService.getSurveyResponses(surveyId),
    enabled: !!surveyId,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useSurveySubjectsByAudience(
  surveyId: string,
  career: string,
  year: number
) {
  return useQuery({
    queryKey: ['survey-subjects-audience', surveyId, career, year],
    queryFn: () => surveyService.getSurveySubjectsByAudience({ surveyId, career, year }),
    enabled: !!surveyId && !!career && !!year,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useAudienceResponses(
  surveyId: string,
  careerId: string,
  year: number
) {
  return useQuery({
    queryKey: ['audience-responses', surveyId, careerId, year],
    queryFn: () => surveyService.getAudienceResponses({ surveyId, careerId, year }),
    enabled: !!surveyId && !!careerId && !!year,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// ===========================================
// HOOKS PARA ENCUESTAS DEL USUARIO
// ===========================================

/**
 * Hook para obtener las encuestas del usuario autenticado
 */
export function useUserSurveys(filters?: UserSurveyFilters) {
  return useQuery({
    queryKey: userSurveysKeys.list(filters),
    queryFn: () => userSurveysService.getMySurveys(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para obtener solo las encuestas pendientes del usuario
 */
export function usePendingSurveys() {
  return useQuery({
    queryKey: userSurveysKeys.list({ status: 'pending' }),
    queryFn: () => userSurveysService.getPendingSurveys(),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener solo las encuestas completadas del usuario
 */
export function useCompletedSurveys() {
  return useQuery({
    queryKey: userSurveysKeys.list({ status: 'completed' }),
    queryFn: () => userSurveysService.getCompletedSurveys(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000,
  });
}

/**
 * Hook para obtener una encuesta específica para responder
 */
export function useSurveyForResponse(surveyId: string, readOnly: boolean = false) {
  return useQuery({
    queryKey: [...userSurveysKeys.all, 'survey-for-response', surveyId, readOnly],
    queryFn: () => userSurveysService.getSurveyForResponse(surveyId, readOnly),
    enabled: !!surveyId,
    staleTime: readOnly ? 10 * 60 * 1000 : 30 * 1000,
    gcTime: readOnly ? 30 * 60 * 1000 : 5 * 60 * 1000,
  });
}

/**
 * Hook para enviar respuestas de una encuesta
 */
export function useSubmitSurveyResponse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      surveyId,
      surveySubjectId,
      subjectAnswers
    }: { 
      surveyId: string;
      surveySubjectId: string;
      subjectAnswers: Array<{ questionId: string; selectedValue?: number; text?: string; }>; 
    }) => {
      return userSurveysService.submitSurveyResponse(surveyId, { surveySubjectId, subjectAnswers });
    },
    onSuccess: (_, { surveyId }) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: userSurveysKeys.all });
      queryClient.invalidateQueries({ 
        queryKey: [...userSurveysKeys.all, 'survey-for-response', surveyId] 
      });
    },
    onError: (error) => {
      console.error('Error al enviar respuesta de encuesta:', error);
    }
  });
}

/**
 * Hook para obtener todos los survey subjects de una encuesta específica para el usuario actual
 */
export function useSurveySubjectsForUser(surveyId: string) {
  return useQuery({
    queryKey: [...userSurveysKeys.all, 'survey-subjects', surveyId],
    queryFn: () => userSurveysService.getSurveySubjectsForUser(surveyId),
    enabled: !!surveyId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Re-exportar tipos necesarios
export type { UserSurveyDto, UserSurveyFilters } from '../services/user-surveys-service';

