namespace AcadEvalSys.Domain.Entities
{
    public class AcademicSurveyResponse : BaseEntity
    {
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

        //FK a Student
        public Guid StudentId { get; set; }
        //FK a AcademicSurvey
        public Guid AcademicSurveyId { get; set; }
    }
}
