import { useState } from 'react';
import { SurveyForm } from '../models/survey-types';

export function useSurveyFormValidationBasic() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: SurveyForm): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar título
    if (!formData.title || formData.title.trim().length === 0) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }

    // Validar descripción (opcional, pero si se proporciona debe tener al menos 10 caracteres)
    if (formData.description && formData.description.trim().length > 0 && formData.description.trim().length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    // Validar preguntas
    if (!formData.questions || formData.questions.length === 0) {
      newErrors.questions = 'Debe agregar al menos una pregunta';
    } else {
      formData.questions.forEach((question, index) => {
        if (!question.text || question.text.trim().length === 0) {
          newErrors[`question_${index}_text`] = 'El texto de la pregunta es requerido';
        }

        // Validar opciones para preguntas de opción múltiple
        if (question.type === 1 && (!question.options || question.options.length < 2)) {
          newErrors[`question_${index}_options`] = 'Las preguntas de opción múltiple deben tener al menos 2 opciones';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearFieldError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    errors,
    validateForm,
    clearErrors,
    clearFieldError,
  };
}
