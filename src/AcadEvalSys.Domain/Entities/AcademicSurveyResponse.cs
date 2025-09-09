namespace AcadEvalSys.Domain.Entities
{
    public class AcademicSurveyResponse : BaseEntity
    {
        public Guid? AcademicSurveySubjectId { get; set; }
        public string UserId { get; set; }
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        // Navegación
        public virtual User User { get; set; } = null!;
        public virtual ICollection<SurveyQuestionResponse> QuestionResponses { get; set; } = new List<SurveyQuestionResponse>();
    }
}
