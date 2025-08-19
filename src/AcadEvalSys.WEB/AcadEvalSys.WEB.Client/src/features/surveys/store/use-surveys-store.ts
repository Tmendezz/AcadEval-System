import { create } from 'zustand';

interface Survey {
  id: string;
  title: string;
  description: string;
  type: 'student_evaluation' | 'professor_feedback' | 'course_evaluation';
  status: 'draft' | 'active' | 'completed' | 'archived';
  questions: SurveyQuestion[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  targetAudience: 'students' | 'professors' | 'coordinators';
  responses: SurveyResponse[];
}

interface SurveyQuestion {
  id: string;
  order: number;
  type: 'multiple_choice' | 'rating' | 'text' | 'yes_no';
  question: string;
  required: boolean;
  options?: string[];
  minRating?: number;
  maxRating?: number;
}

interface SurveyResponse {
  id: string;
  surveyId: string;
  respondentId: string;
  respondentType: 'student' | 'professor' | 'coordinator';
  answers: SurveyAnswer[];
  completedAt: string;
  isAnonymous: boolean;
}

interface SurveyAnswer {
  questionId: string;
  value: string | number;
  textValue?: string;
}

interface SurveyFormData {
  title: string;
  description: string;
  type: Survey['type'];
  targetAudience: Survey['targetAudience'];
  questions: Omit<SurveyQuestion, 'id'>[];
}

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
  
  // Estado de respuestas
  responses: SurveyResponse[];
  isLoadingResponses: boolean;
  responsesError: string | null;
  
  // Filtros y búsqueda
  searchTerm: string;
  statusFilter: Survey['status'] | 'all';
  typeFilter: Survey['type'] | 'all';
  
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
  
  // Acciones de respuestas
  setResponses: (responses: SurveyResponse[]) => void;
  addResponse: (response: SurveyResponse) => void;
  setLoadingResponses: (isLoading: boolean) => void;
  setResponsesError: (error: string | null) => void;
  
  // Acciones de filtros
  setSearchTerm: (term: string) => void;
  setStatusFilter: (filter: Survey['status'] | 'all') => void;
  setTypeFilter: (filter: Survey['type'] | 'all') => void;
  clearFilters: () => void;
  
  // Acciones de estadísticas
  setSurveyStats: (stats: SurveysState['surveyStats']) => void;
  
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
  
  // Funciones de utilidad
  getFilteredSurveys: () => Survey[];
  getSurveyResponseCount: (surveyId: string) => number;
  getSurveyCompletionRate: (surveyId: string) => number;
  getResponsesByQuestion: (surveyId: string, questionId: string) => SurveyAnswer[];
}

const initialFormData: SurveyFormData = {
  title: '',
  description: '',
  type: 'student_evaluation',
  targetAudience: 'students',
  questions: [],
};

const initialStats = {
  totalSurveys: 0,
  activeSurveys: 0,
  totalResponses: 0,
  averageCompletionRate: 0,
};

export const useSurveysStore = create<SurveysState>((set, get) => ({
  // Estado inicial
  surveys: [],
  selectedSurvey: null,
  isLoading: false,
  error: null,
  isCreating: false,
  isEditing: false,
  formData: null,
  formErrors: {},
  responses: [],
  isLoadingResponses: false,
  responsesError: null,
  searchTerm: '',
  statusFilter: 'all',
  typeFilter: 'all',
  surveyStats: null,
  showCreateModal: false,
  showEditModal: false,
  showDeleteConfirm: false,
  showResponsesModal: false,

  // Acciones principales
  setSurveys: (surveys) => set({ surveys }),
  
  addSurvey: (survey) => set((state) => ({ 
    surveys: [...state.surveys, survey] 
  })),
  
  updateSurvey: (id, updates) => set((state) => ({
    surveys: state.surveys.map(survey => 
      survey.id === id ? { ...survey, ...updates } : survey
    ),
    selectedSurvey: state.selectedSurvey?.id === id 
      ? { ...state.selectedSurvey, ...updates }
      : state.selectedSurvey
  })),
  
  deleteSurvey: (id) => set((state) => ({
    surveys: state.surveys.filter(survey => survey.id !== id),
    selectedSurvey: state.selectedSurvey?.id === id ? null : state.selectedSurvey
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

  // Acciones de respuestas
  setResponses: (responses) => set({ responses }),
  addResponse: (response) => set((state) => ({ 
    responses: [...state.responses, response] 
  })),
  setLoadingResponses: (isLoading) => set({ isLoadingResponses: isLoading }),
  setResponsesError: (error) => set({ responsesError: error }),

  // Acciones de filtros
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setTypeFilter: (filter) => set({ typeFilter: filter }),
  clearFilters: () => set({ 
    searchTerm: '', 
    statusFilter: 'all', 
    typeFilter: 'all' 
  }),

  // Acciones de estadísticas
  setSurveyStats: (stats) => set({ surveyStats: stats }),

  // Acciones de modales
  openCreateModal: () => set({ 
    showCreateModal: true, 
    formData: { ...initialFormData },
    formErrors: {} 
  }),
  
  closeCreateModal: () => set({ 
    showCreateModal: false, 
    formData: null,
    formErrors: {},
    isCreating: false 
  }),
  
  openEditModal: (survey) => set({ 
    showEditModal: true,
    selectedSurvey: survey,
    formData: {
      title: survey.title,
      description: survey.description,
      type: survey.type,
      targetAudience: survey.targetAudience,
      questions: survey.questions.map(({ id, ...rest }) => rest),
    },
    formErrors: {} 
  }),
  
  closeEditModal: () => set({ 
    showEditModal: false, 
    formData: null,
    formErrors: {},
    isEditing: false 
  }),
  
  openDeleteConfirm: (survey) => set({ 
    showDeleteConfirm: true, 
    selectedSurvey: survey 
  }),
  
  closeDeleteConfirm: () => set({ 
    showDeleteConfirm: false, 
    selectedSurvey: null 
  }),
  
  openResponsesModal: (survey) => set({ 
    showResponsesModal: true, 
    selectedSurvey: survey 
  }),
  
  closeResponsesModal: () => set({ 
    showResponsesModal: false 
  }),
  
  closeAllModals: () => set({
    showCreateModal: false,
    showEditModal: false,
    showDeleteConfirm: false,
    showResponsesModal: false,
    formData: null,
    formErrors: {},
    isCreating: false,
    isEditing: false,
  }),

  // Funciones de utilidad
  getFilteredSurveys: () => {
    const { surveys, searchTerm, statusFilter, typeFilter } = get();
    
    return surveys.filter(survey => {
      const matchesSearch = searchTerm === '' || 
        survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        survey.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
      const matchesType = typeFilter === 'all' || survey.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  },
  
  getSurveyResponseCount: (surveyId) => {
    const { responses } = get();
    return responses.filter(response => response.surveyId === surveyId).length;
  },
  
  getSurveyCompletionRate: (surveyId) => {
    const { surveys } = get();
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) return 0;
    
    const responseCount = get().getSurveyResponseCount(surveyId);
    // Aquí deberías calcular el total de usuarios objetivo
    // Por ahora uso un valor estimado
    const totalTargetUsers = 100; 
    
    return responseCount > 0 ? (responseCount / totalTargetUsers) * 100 : 0;
  },
  
  getResponsesByQuestion: (surveyId, questionId) => {
    const { responses } = get();
    return responses
      .filter(response => response.surveyId === surveyId)
      .flatMap(response => response.answers)
      .filter(answer => answer.questionId === questionId);
  },
}));