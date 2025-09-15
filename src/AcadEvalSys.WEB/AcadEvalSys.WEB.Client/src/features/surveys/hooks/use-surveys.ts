import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { surveyService } from '../services/survey-service';
import { SurveyForm, SurveyFilters } from '../models/survey-types';
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
    mutationFn: (survey: SurveyForm) => surveyService.createSurvey(survey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
    },
  });
}

export function useUpdateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, survey }: { id: string; survey: SurveyForm }) =>
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

