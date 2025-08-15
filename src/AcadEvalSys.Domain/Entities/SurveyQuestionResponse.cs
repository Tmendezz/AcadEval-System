namespace AcadEvalSys.Domain.Entities
{
    /// <summary>
    /// Respuesta a una pregunta de encuesta (se mantiene separado del módulo de competencias).
    /// </summary>
    public class SurveyQuestionResponse : BaseEntity
    {
        public Guid AcademicSurveyResponseId { get; set; }
        public Guid AcademicSurveySubjectId { get; set; }

        public Guid FormQuestionId { get; set; }

        public int? SelectedValue { get; set; }
        public string? Text { get; set; }        // “Observaciones”

        public virtual FormQuestion? FormQuestion { get; set; }
    }
}
