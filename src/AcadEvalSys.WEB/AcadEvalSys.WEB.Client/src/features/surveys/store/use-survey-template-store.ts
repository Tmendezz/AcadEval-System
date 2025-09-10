import { create } from "zustand";
import {
  SurveyTemplateQuestion,
  SurveyTemplateType,
  CreateSurveyTemplateQuestionRequest,
} from "@/shared/types";

// Estado para el formulario de creación/edición de plantillas
export interface SurveyTemplateFormState {
  // Datos básicos de la plantilla
  title: string;
  description: string;
  surveyType: SurveyTemplateType;
  isDraft: boolean;
  
  // Preguntas en construcción
  questions: CreateSurveyTemplateQuestionRequest[];
  
  // UI State
  isEditMode: boolean;
  editingQuestionId: string | null;
  
  // Actions
  setBasicInfo: (info: {
    title: string;
    description: string;
    surveyType: SurveyTemplateType;
    isDraft: boolean;
  }) => void;
  
  addQuestion: (question: CreateSurveyTemplateQuestionRequest) => void;
  updateQuestion: (index: number, question: CreateSurveyTemplateQuestionRequest) => void;
  removeQuestion: (index: number) => void;
  reorderQuestions: (fromIndex: number, toIndex: number) => void;
  
  setEditingQuestion: (id: string | null) => void;
  
  // Form management
  resetForm: () => void;
  loadTemplate: (template: {
    title: string;
    description: string;
    surveyType: SurveyTemplateType;
    isDraft: boolean;
    questions: SurveyTemplateQuestion[];
  }) => void;
}

const initialState = {
  title: "",
  description: "",
  surveyType: SurveyTemplateType.Student,
  isDraft: true,
  questions: [],
  isEditMode: false,
  editingQuestionId: null,
};

export const useSurveyTemplateStore = create<SurveyTemplateFormState>((set) => ({
  ...initialState,

  setBasicInfo: (info) =>
    set((state) => ({
      ...state,
      ...info,
    })),

  addQuestion: (question) =>
    set((state) => {
      const newQuestion = {
        ...question,
        order: state.questions.length + 1,
      };
      return {
        ...state,
        questions: [...state.questions, newQuestion],
      };
    }),

  updateQuestion: (index, question) =>
    set((state) => {
      const updatedQuestions = [...state.questions];
      updatedQuestions[index] = question;
      return {
        ...state,
        questions: updatedQuestions,
      };
    }),

  removeQuestion: (index) =>
    set((state) => {
      const updatedQuestions = state.questions.filter((_, i) => i !== index);
      // Reordenar los índices
      const reorderedQuestions = updatedQuestions.map((q, i) => ({
        ...q,
        order: i + 1,
      }));
      return {
        ...state,
        questions: reorderedQuestions,
      };
    }),

  reorderQuestions: (fromIndex, toIndex) =>
    set((state) => {
      const questions = [...state.questions];
      const [removed] = questions.splice(fromIndex, 1);
      questions.splice(toIndex, 0, removed);
      
      // Actualizar el orden
      const reorderedQuestions = questions.map((q, i) => ({
        ...q,
        order: i + 1,
      }));

      return {
        ...state,
        questions: reorderedQuestions,
      };
    }),

  setEditingQuestion: (id) =>
    set((state) => ({
      ...state,
      editingQuestionId: id,
    })),

  resetForm: () => set(() => ({ ...initialState })),

  loadTemplate: (template) =>
    set(() => ({
      ...initialState,
      ...template,
      questions: template.questions.map((q) => ({
        text: q.text,
        type: q.type,
        isRequired: q.isRequired,
        order: q.order,
        options: q.options?.map((opt) => ({
          text: opt.text,
          value: opt.value,
          order: opt.order,
        })),
        scaleMin: q.scaleMin,
        scaleMax: q.scaleMax,
        scaleLabels: q.scaleLabels,
      })),
      isEditMode: true,
    })),
}));
