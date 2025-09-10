import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSurveyTemplates,
  getSurveyTemplateById,
  createSurveyTemplate,
  updateSurveyTemplate,
  deleteSurveyTemplate
} from "@/shared/services";
import {
  CreateSurveyTemplateRequest,
  UpdateSurveyTemplateRequest,
  SurveyTemplatesFilters
} from "@/shared/types";

// Query keys
export const SURVEY_TEMPLATES_KEYS = {
  all: ["survey-templates"] as const,
  lists: () => [...SURVEY_TEMPLATES_KEYS.all, "list"] as const,
  list: (filters: SurveyTemplatesFilters) => 
    [...SURVEY_TEMPLATES_KEYS.lists(), filters] as const,
  details: () => [...SURVEY_TEMPLATES_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SURVEY_TEMPLATES_KEYS.details(), id] as const,
};

// Hook para obtener todas las plantillas con filtros
export const useSurveyTemplates = (filters?: SurveyTemplatesFilters) => {
  return useQuery({
    queryKey: SURVEY_TEMPLATES_KEYS.list(filters || {}),
    queryFn: () => getSurveyTemplates(filters),
  });
};

// Hook para obtener una plantilla específica
export const useSurveyTemplate = (id: string) => {
  return useQuery({
    queryKey: SURVEY_TEMPLATES_KEYS.detail(id),
    queryFn: () => getSurveyTemplateById(id),
    enabled: !!id,
  });
};

// Hook para crear plantilla
export const useCreateSurveyTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: CreateSurveyTemplateRequest) => 
      createSurveyTemplate(template),
    onSuccess: () => {
      // Invalidar todas las listas de plantillas
      queryClient.invalidateQueries({
        queryKey: SURVEY_TEMPLATES_KEYS.lists(),
      });
    },
  });
};

// Hook para actualizar plantilla
export const useUpdateSurveyTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, template }: { id: string; template: UpdateSurveyTemplateRequest }) =>
      updateSurveyTemplate(id, template),
    onSuccess: (_, { id }) => {
      // Invalidar listas y detalle específico
      queryClient.invalidateQueries({
        queryKey: SURVEY_TEMPLATES_KEYS.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: SURVEY_TEMPLATES_KEYS.detail(id),
      });
    },
  });
};

// Hook para eliminar plantilla
export const useDeleteSurveyTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSurveyTemplate(id),
    onSuccess: () => {
      // Invalidar todas las listas
      queryClient.invalidateQueries({
        queryKey: SURVEY_TEMPLATES_KEYS.lists(),
      });
    },
  });
};
