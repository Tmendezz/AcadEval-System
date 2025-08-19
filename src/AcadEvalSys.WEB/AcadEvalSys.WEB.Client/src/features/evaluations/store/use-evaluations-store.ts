import { create } from 'zustand';

interface EvaluationInstance {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  createdBy: string;
  assignmentsCount: number;
}

interface EvaluationWizardData {
  basicInfo: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
  } | null;
  competencyAssignments: any[];
  currentStep: number;
  isValid: boolean;
}

interface EvaluationsState {
  // Estado de evaluaciones
  evaluations: EvaluationInstance[];
  selectedEvaluation: EvaluationInstance | null;
  isLoading: boolean;
  error: string | null;
  
  // Estado del wizard de creación
  wizardData: EvaluationWizardData;
  isCreating: boolean;
  
  // Filtros y paginación
  filters: {
    search: string;
    status: string;
    dateRange: {
      from: string;
      to: string;
    } | null;
  };
  
  // Acciones de evaluaciones
  setEvaluations: (evaluations: EvaluationInstance[]) => void;
  addEvaluation: (evaluation: EvaluationInstance) => void;
  updateEvaluation: (id: string, updates: Partial<EvaluationInstance>) => void;
  deleteEvaluation: (id: string) => void;
  setSelectedEvaluation: (evaluation: EvaluationInstance | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Acciones del wizard
  setWizardData: (data: Partial<EvaluationWizardData>) => void;
  setWizardStep: (step: number) => void;
  setWizardBasicInfo: (basicInfo: EvaluationWizardData['basicInfo']) => void;
  setWizardAssignments: (assignments: any[]) => void;
  resetWizard: () => void;
  setCreating: (isCreating: boolean) => void;
  
  // Acciones de filtros
  setFilters: (filters: Partial<EvaluationsState['filters']>) => void;
  clearFilters: () => void;
}

const initialWizardData: EvaluationWizardData = {
  basicInfo: null,
  competencyAssignments: [],
  currentStep: 0,
  isValid: false,
};

const initialFilters = {
  search: '',
  status: 'all',
  dateRange: null,
};

export const useEvaluationsStore = create<EvaluationsState>((set, get) => ({
  // Estado inicial
  evaluations: [],
  selectedEvaluation: null,
  isLoading: false,
  error: null,
  wizardData: initialWizardData,
  isCreating: false,
  filters: initialFilters,

  // Acciones de evaluaciones
  setEvaluations: (evaluations) => set({ evaluations }),
  
  addEvaluation: (evaluation) => set((state) => ({ 
    evaluations: [...state.evaluations, evaluation] 
  })),
  
  updateEvaluation: (id, updates) => set((state) => ({
    evaluations: state.evaluations.map(evaluation => 
      evaluation.id === id ? { ...evaluation, ...updates } : evaluation
    ),
    selectedEvaluation: state.selectedEvaluation?.id === id 
      ? { ...state.selectedEvaluation, ...updates }
      : state.selectedEvaluation
  })),
  
  deleteEvaluation: (id) => set((state) => ({
    evaluations: state.evaluations.filter(evaluation => evaluation.id !== id),
    selectedEvaluation: state.selectedEvaluation?.id === id 
      ? null 
      : state.selectedEvaluation
  })),
  
  setSelectedEvaluation: (evaluation) => set({ selectedEvaluation: evaluation }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  // Acciones del wizard
  setWizardData: (data) => set((state) => ({
    wizardData: { ...state.wizardData, ...data }
  })),
  
  setWizardStep: (step) => set((state) => ({
    wizardData: { ...state.wizardData, currentStep: step }
  })),
  
  setWizardBasicInfo: (basicInfo) => set((state) => ({
    wizardData: { ...state.wizardData, basicInfo }
  })),
  
  setWizardAssignments: (assignments) => set((state) => ({
    wizardData: { ...state.wizardData, competencyAssignments: assignments }
  })),
  
  resetWizard: () => set({ wizardData: initialWizardData }),
  
  setCreating: (isCreating) => set({ isCreating }),

  // Acciones de filtros
  setFilters: (newFilters) => set((state) => ({
    filters: { ...state.filters, ...newFilters }
  })),
  
  clearFilters: () => set({ filters: initialFilters }),
}));