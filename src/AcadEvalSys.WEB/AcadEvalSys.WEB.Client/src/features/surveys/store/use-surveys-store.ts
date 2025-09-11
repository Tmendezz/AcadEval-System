/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { Survey, SurveyFormData } from "../types/surveys";
import { initialFormData } from "../constants/surveys";

interface SurveysState {
  // Estado de encuestas
  surveys: Survey[];
  selectedSurvey: Survey | null;
  isLoading: boolean;
  error: string | null;

  // Estado de formulario de creación/edición
  isCreating: boolean;
  isEditing: boolean;
  formData: SurveyFormData | null;
  formErrors: Record<string, string>;

  // Estado de plantilla seleccionada
  selectedTemplateId: string | null;

  // Filtros y búsqueda
  searchTerm: string;
  statusFilter: Survey["status"] | "all";
  typeFilter: Survey["type"] | "all";

  // Estadísticas
  surveyStats: {
    totalSurveys: number;
    activeSurveys: number;
    totalResponses: number;
    averageCompletionRate: number;
  } | null;

  // Modales
  showCreateModal: boolean;
  showEditModal: boolean;
  showDeleteConfirm: boolean;
  showResponsesModal: boolean;

  // Acciones principales
  setSurveys: (surveys: Survey[]) => void;
  addSurvey: (survey: Survey) => void;
  updateSurvey: (id: string, updates: Partial<Survey>) => void;
  deleteSurvey: (id: string) => void;
  setSelectedSurvey: (survey: Survey | null) => void;

  // Acciones de estado
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Acciones de formulario
  setFormData: (data: SurveyFormData | null) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  clearFormErrors: () => void;
  setCreating: (isCreating: boolean) => void;
  setEditing: (isEditing: boolean) => void;

  // Acciones de plantilla
  setSelectedTemplateId: (templateId: string | null) => void;


  // Acciones de filtros
  setSearchTerm: (term: string) => void;
  setStatusFilter: (filter: Survey["status"] | "all") => void;
  setTypeFilter: (filter: Survey["type"] | "all") => void;
  clearFilters: () => void;

  // Acciones de estadísticas
  setSurveyStats: (stats: SurveysState["surveyStats"]) => void;

  // Acciones de modales
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (survey: Survey) => void;
  closeEditModal: () => void;
  openDeleteConfirm: (survey: Survey) => void;
  closeDeleteConfirm: () => void;
  openResponsesModal: (survey: Survey) => void;
  closeResponsesModal: () => void;
  closeAllModals: () => void;

  // Funciones de utilidad (filtrado se realiza en componentes con React Query)
}

// Las constantes y tipos ahora se importan desde archivos dedicados

// Nota: limitar este store a estado de UI. Server state se maneja con React Query.
export const useSurveysStore = create<SurveysState>((set) => ({
  // Estado inicial
  surveys: [], // deprecated: no poblar desde red
  selectedSurvey: null,
  isLoading: false,
  error: null,
  isCreating: false,
  isEditing: false,
  formData: null,
  formErrors: {},
  selectedTemplateId: null,
  // Estado de respuestas removido
  searchTerm: "",
  statusFilter: "all",
  typeFilter: "all",
  surveyStats: null,
  showCreateModal: false,
  showEditModal: false,
  showDeleteConfirm: false,
  showResponsesModal: false,

  // Acciones principales
  setSurveys: (surveys) => set({ surveys }),

  addSurvey: (survey) =>
    set((state) => ({
      surveys: [...state.surveys, survey],
    })),

  updateSurvey: (id, updates) =>
    set((state) => ({
      surveys: state.surveys.map((survey) =>
        survey.id === id ? { ...survey, ...updates } : survey
      ),
      selectedSurvey:
        state.selectedSurvey?.id === id
          ? { ...state.selectedSurvey, ...updates }
          : state.selectedSurvey,
    })),

  deleteSurvey: (id) =>
    set((state) => ({
      surveys: state.surveys.filter((survey) => survey.id !== id),
      selectedSurvey:
        state.selectedSurvey?.id === id ? null : state.selectedSurvey,
    })),

  setSelectedSurvey: (survey) => set({ selectedSurvey: survey }),

  // Acciones de estado
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Acciones de formulario
  setFormData: (data) => set({ formData: data }),
  setFormErrors: (errors) => set({ formErrors: errors }),
  clearFormErrors: () => set({ formErrors: {} }),
  setCreating: (isCreating) => set({ isCreating }),
  setEditing: (isEditing) => set({ isEditing }),

  // Acciones de plantilla
  setSelectedTemplateId: (templateId) => set({ selectedTemplateId: templateId }),

  // Acciones de respuestas removidas

  // Acciones de filtros
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setTypeFilter: (filter) => set({ typeFilter: filter }),
  clearFilters: () =>
    set({
      searchTerm: "",
      statusFilter: "all",
      typeFilter: "all",
    }),

  // Acciones de estadísticas
  setSurveyStats: (stats) => set({ surveyStats: stats }),

  // Acciones de modales
  openCreateModal: () =>
    set({
      showCreateModal: true,
      formData: { ...initialFormData },
      formErrors: {},
    }),

  closeCreateModal: () =>
    set({
      showCreateModal: false,
      formData: null,
      formErrors: {},
      isCreating: false,
    }),

  openEditModal: (survey) =>
    set({
      showEditModal: true,
      selectedSurvey: survey,
      formData: {
        title: survey.title,
        description: survey.description,
        type: survey.type,
        targetAudience: survey.targetAudience,
        questions: survey.questions.map(({ id: _id, ...rest }) => rest),
      },
      formErrors: {},
    }),

  closeEditModal: () =>
    set({
      showEditModal: false,
      formData: null,
      formErrors: {},
      isEditing: false,
    }),

  openDeleteConfirm: (survey) =>
    set({
      showDeleteConfirm: true,
      selectedSurvey: survey,
    }),

  closeDeleteConfirm: () =>
    set({
      showDeleteConfirm: false,
      selectedSurvey: null,
    }),

  openResponsesModal: (survey) =>
    set({
      showResponsesModal: true,
      selectedSurvey: survey,
    }),

  closeResponsesModal: () =>
    set({
      showResponsesModal: false,
    }),

  closeAllModals: () =>
    set({
      showCreateModal: false,
      showEditModal: false,
      showDeleteConfirm: false,
      showResponsesModal: false,
      formData: null,
      formErrors: {},
      isCreating: false,
      isEditing: false,
    }),


}));
