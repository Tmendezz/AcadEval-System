import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tipos para las respuestas
export interface QuestionResponse {
  questionId: string;
  answer: string | string[]; // string para texto/single, string[] para multiple
  answeredAt: Date;
}

export interface SubjectResponse {
  subjectId: string;
  subjectName: string;
  professorName: string;
  responses: QuestionResponse[];
  isCompleted: boolean;
  completedAt?: Date;
  lastModified: Date;
}

interface SurveyResponseState {
  // Estado principal
  surveyId: string | null;
  surveyTitle: string | null;
  
  // Respuestas por materia
  subjectResponses: Record<string, SubjectResponse>; // key: subjectId
  
  // Estado de navegación
  currentSubjectId: string | null;
  completedSubjects: Set<string>;
  
  // Metadatos
  startedAt: Date | null;
  lastSavedAt: Date | null;
  
  // Acciones principales
  initializeSurvey: (surveyId: string, surveyTitle: string, subjects: Array<{
    surveySubjectId: string;
    subjectName: string;
    professorName: string;
  }>) => void;
  
  // Gestión de respuestas
  saveResponse: (subjectId: string, questionId: string, answer: string | string[]) => void;
  getSubjectResponses: (subjectId: string) => QuestionResponse[];
  getQuestionResponse: (subjectId: string, questionId: string) => QuestionResponse | undefined;
  
  // Control de completitud
  markSubjectComplete: (subjectId: string) => void;
  markSubjectIncomplete: (subjectId: string) => void;
  isSubjectComplete: (subjectId: string) => boolean;
  
  // Navegación
  setCurrentSubject: (subjectId: string) => void;
  getCurrentSubject: () => SubjectResponse | null;
  
  // Progreso
  getOverallProgress: () => {
    total: number;
    completed: number;
    percentage: number;
  };
  
  // Gestión de estado
  clearSurvey: () => void;
  clearSubjectResponses: (subjectId: string) => void;
  
  // Persistencia/sincronización
  markSaved: () => void;
  hasUnsavedChanges: () => boolean;
  
  // Utilidades
  exportResponses: () => Record<string, any>;
  getAllCompletedResponses: () => SubjectResponse[];
}

export const useSurveyResponseStore = create<SurveyResponseState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      surveyId: null,
      surveyTitle: null,
      subjectResponses: {},
      currentSubjectId: null,
      completedSubjects: new Set(),
      startedAt: null,
      lastSavedAt: null,

      // Inicializar encuesta
      initializeSurvey: (surveyId, surveyTitle, subjects) => {
        const now = new Date();
        const subjectResponses: Record<string, SubjectResponse> = {};
        
        // Crear estructura inicial para cada materia
        subjects.forEach(subject => {
          subjectResponses[subject.surveySubjectId] = {
            subjectId: subject.surveySubjectId,
            subjectName: subject.subjectName,
            professorName: subject.professorName,
            responses: [],
            isCompleted: false,
            lastModified: now,
          };
        });

        set({
          surveyId,
          surveyTitle,
          subjectResponses,
          completedSubjects: new Set(),
          startedAt: now,
          currentSubjectId: subjects[0]?.surveySubjectId || null,
        });
      },

      // Guardar respuesta de una pregunta
      saveResponse: (subjectId, questionId, answer) => {
        const state = get();
        const now = new Date();
        
        const currentSubject = state.subjectResponses[subjectId];
        if (!currentSubject) return;

        // Buscar si ya existe una respuesta para esta pregunta
        const existingResponseIndex = currentSubject.responses.findIndex(
          r => r.questionId === questionId
        );

        const newResponse: QuestionResponse = {
          questionId,
          answer,
          answeredAt: now,
        };

        let updatedResponses;
        if (existingResponseIndex >= 0) {
          // Actualizar respuesta existente
          updatedResponses = [...currentSubject.responses];
          updatedResponses[existingResponseIndex] = newResponse;
        } else {
          // Agregar nueva respuesta
          updatedResponses = [...currentSubject.responses, newResponse];
        }

        set(state => ({
          subjectResponses: {
            ...state.subjectResponses,
            [subjectId]: {
              ...currentSubject,
              responses: updatedResponses,
              lastModified: now,
            }
          }
        }));
      },

      // Obtener respuestas de una materia
      getSubjectResponses: (subjectId) => {
        const state = get();
        return state.subjectResponses[subjectId]?.responses || [];
      },

      // Obtener respuesta específica de una pregunta
      getQuestionResponse: (subjectId, questionId) => {
        const state = get();
        const subject = state.subjectResponses[subjectId];
        return subject?.responses.find(r => r.questionId === questionId);
      },

      // Marcar materia como completada
      markSubjectComplete: (subjectId) => {
        const state = get();
        const now = new Date();
        
        set(state => ({
          subjectResponses: {
            ...state.subjectResponses,
            [subjectId]: {
              ...state.subjectResponses[subjectId],
              isCompleted: true,
              completedAt: now,
              lastModified: now,
            }
          },
          completedSubjects: new Set([...state.completedSubjects, subjectId])
        }));
      },

      // Marcar materia como incompleta
      markSubjectIncomplete: (subjectId) => {
        set(state => {
          const newCompletedSubjects = new Set(state.completedSubjects);
          newCompletedSubjects.delete(subjectId);
          
          return {
            subjectResponses: {
              ...state.subjectResponses,
              [subjectId]: {
                ...state.subjectResponses[subjectId],
                isCompleted: false,
                completedAt: undefined,
                lastModified: new Date(),
              }
            },
            completedSubjects: newCompletedSubjects
          };
        });
      },

      // Verificar si una materia está completa
      isSubjectComplete: (subjectId) => {
        const state = get();
        return state.subjectResponses[subjectId]?.isCompleted || false;
      },

      // Establecer materia actual
      setCurrentSubject: (subjectId) => {
        set({ currentSubjectId: subjectId });
      },

      // Obtener materia actual
      getCurrentSubject: () => {
        const state = get();
        return state.currentSubjectId ? state.subjectResponses[state.currentSubjectId] || null : null;
      },

      // Calcular progreso general
      getOverallProgress: () => {
        const state = get();
        const total = Object.keys(state.subjectResponses).length;
        const completed = state.completedSubjects.size;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return { total, completed, percentage };
      },

      // Limpiar toda la encuesta
      clearSurvey: () => {
        set({
          surveyId: null,
          surveyTitle: null,
          subjectResponses: {},
          currentSubjectId: null,
          completedSubjects: new Set(),
          startedAt: null,
          lastSavedAt: null,
        });
      },

      // Limpiar respuestas de una materia específica
      clearSubjectResponses: (subjectId) => {
        set(state => {
          const subject = state.subjectResponses[subjectId];
          if (!subject) return state;

          const newCompletedSubjects = new Set(state.completedSubjects);
          newCompletedSubjects.delete(subjectId);

          return {
            subjectResponses: {
              ...state.subjectResponses,
              [subjectId]: {
                ...subject,
                responses: [],
                isCompleted: false,
                completedAt: undefined,
                lastModified: new Date(),
              }
            },
            completedSubjects: newCompletedSubjects
          };
        });
      },

      // Marcar como guardado
      markSaved: () => {
        set({ lastSavedAt: new Date() });
      },

      // Verificar cambios no guardados
      hasUnsavedChanges: () => {
        const state = get();
        if (!state.lastSavedAt) return true;
        
        // Verificar si alguna materia fue modificada después del último guardado
        return Object.values(state.subjectResponses).some(
          subject => subject.lastModified > state.lastSavedAt!
        );
      },

      // Exportar respuestas para envío al servidor
      exportResponses: () => {
        const state = get();
        const result: Record<string, any> = {};
        
        Object.values(state.subjectResponses).forEach(subject => {
          if (subject.responses.length > 0) {
            result[subject.subjectId] = {
              subjectName: subject.subjectName,
              professorName: subject.professorName,
              isCompleted: subject.isCompleted,
              completedAt: subject.completedAt,
              responses: subject.responses.map(r => ({
                questionId: r.questionId,
                answer: r.answer,
                answeredAt: r.answeredAt instanceof Date ? r.answeredAt.toISOString() : new Date(r.answeredAt).toISOString(),
              }))
            };
          }
        });
        
        return result;
      },

      // Obtener todas las materias completadas
      getAllCompletedResponses: () => {
        const state = get();
        return Object.values(state.subjectResponses).filter(subject => subject.isCompleted);
      },
    }),
    {
      name: 'survey-responses', // Nombre para localStorage
      partialize: (state) => ({
        // Solo persistir lo esencial
        surveyId: state.surveyId,
        surveyTitle: state.surveyTitle,
        subjectResponses: state.subjectResponses,
        completedSubjects: Array.from(state.completedSubjects), // Set no es serializable
        currentSubjectId: state.currentSubjectId,
        startedAt: state.startedAt,
        lastSavedAt: state.lastSavedAt,
      }),
      // Reconstruir Set y fechas al cargar del localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Reconstruir Set
          if (Array.isArray((state as any).completedSubjects)) {
            state.completedSubjects = new Set((state as any).completedSubjects);
          }
          
          // Convertir strings de fecha de vuelta a objetos Date
          if (state.startedAt && typeof state.startedAt === 'string') {
            state.startedAt = new Date(state.startedAt);
          }
          if (state.lastSavedAt && typeof state.lastSavedAt === 'string') {
            state.lastSavedAt = new Date(state.lastSavedAt);
          }
          
          // Convertir fechas en las respuestas
          Object.values(state.subjectResponses).forEach(subject => {
            if (subject.lastModified && typeof subject.lastModified === 'string') {
              subject.lastModified = new Date(subject.lastModified);
            }
            if (subject.completedAt && typeof subject.completedAt === 'string') {
              subject.completedAt = new Date(subject.completedAt);
            }
            subject.responses.forEach(response => {
              if (response.answeredAt && typeof response.answeredAt === 'string') {
                response.answeredAt = new Date(response.answeredAt);
              }
            });
          });
        }
      },
    }
  )
);
