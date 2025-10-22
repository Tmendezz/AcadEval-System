import { useFormStore } from "@/shared/stores/form-store";

export const useFormStoreHook = () => {
  const {
    evaluationForm,
    competencyForm,
    subjectForm,
    careerForm,
    updateForm,
    setFormField,
    clearForm,
    clearAllForms,
  } = useFormStore();

  const updateEvaluationForm = (data: unknown) =>
    updateForm("evaluationForm", data);
  const updateCompetencyForm = (data: unknown) =>
    updateForm("competencyForm", data);
  const updateSubjectForm = (data: unknown) => updateForm("subjectForm", data);
  const updateCareerForm = (data: unknown) => updateForm("careerForm", data);

  const clearEvaluationForm = () => clearForm("evaluationForm");
  const clearCompetencyForm = () => clearForm("competencyForm");
  const clearSubjectForm = () => clearForm("subjectForm");
  const clearCareerForm = () => clearForm("careerForm");

  return {
    evaluationForm,
    competencyForm,
    subjectForm,
    careerForm,

    // Acciones generales
    updateForm,
    setFormField,
    clearForm,
    clearAllForms,

    // Helpers específicos
    updateEvaluationForm,
    updateCompetencyForm,
    updateSubjectForm,
    updateCareerForm,
    clearEvaluationForm,
    clearCompetencyForm,
    clearSubjectForm,
    clearCareerForm,
  };
};
