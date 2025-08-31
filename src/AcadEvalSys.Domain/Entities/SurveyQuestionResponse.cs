namespace AcadEvalSys.Domain.Entities
{
    public class SurveyQuestionResponse : BaseEntity
    {
        public Guid AcademicSurveyResponseId { get; set; }
        public Guid AcademicSurveySubjectId { get; set; }

        public Guid SurveyQuestionId { get; set; }   // actualizado para apuntar al snapshot

        public int? SelectedValue { get; set; }
        public string? Text { get; set; }

        public virtual SurveyQuestion? SurveyQuestion { get; set; }
    }
}