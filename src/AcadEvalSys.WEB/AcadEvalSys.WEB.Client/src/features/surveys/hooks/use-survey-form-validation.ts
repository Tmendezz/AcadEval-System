import { useState, useCallback } from 'react';
import { SurveyTemplateQuestion } from '../models/survey-template-types';

// Definir QuestionType localmente
type QuestionType = 'SingleChoice' | 'MultipleChoice' | 'OpenText';

export interface SurveyBasicInfo {
  title: string;
  description: string;
  surveyType: number;
  isDraft: boolean;
}

export interface SurveyFormData {
  title: string;
  description: string;
  surveyType: number;
  isDraft: boolean;
  questions: SurveyTemplateQuestion[];
}

export function useSurveyFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateBasicInfo = useCallback((data: SurveyBasicInfo): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!data.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, []);

  const validateQuestions = useCallback((questions: SurveyTemplateQuestion[]): boolean => {
    const newErrors: Record<string, string> = {};

    if (questions.length === 0) {
      newErrors.questions = 'Debe agregar al menos una pregunta';
    }

    questions.forEach((question, index) => {
      if (!question.text.trim()) {
        newErrors[`question_${index}_text`] = 'El texto de la pregunta es requerido';
      }

      if ((question.type === 'SingleChoice' || question.type === 'MultipleChoice') && question.options.length === 0) {
        newErrors[`question_${index}_options`] = 'Las preguntas de opción múltiple deben tener al menos una opción';
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, []);

  const validateForm = useCallback((data: SurveyFormData): boolean => {
    const basicInfoValid = validateBasicInfo({
      title: data.title,
      description: data.description,
      surveyType: data.surveyType,
      isDraft: data.isDraft,
    });

    const questionsValid = validateQuestions(data.questions);

    return basicInfoValid && questionsValid;
  }, [validateBasicInfo, validateQuestions]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateBasicInfo,
    validateQuestions,
    validateForm,
    clearErrors,
    setFieldError,
    clearFieldError,
  };
}
