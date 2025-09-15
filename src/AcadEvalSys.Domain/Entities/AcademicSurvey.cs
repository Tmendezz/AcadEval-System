using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    public class AcademicSurvey : BaseEntity
    {
        public string Title { get; set; } = string.Empty;

        public Guid TemplateId { get; set; }                 // Plantilla origen del snapshot
        public DateTime? PublishAt { get; set; }
        public DateTime? CloseAt { get; set; }
        public SurveyStatus Status { get; set; } = SurveyStatus.Draft;

        public virtual SurveyTemplate? Template { get; set; }
        public virtual ICollection<SurveyQuestion> Questions { get; set; } = new List<SurveyQuestion>();
        public virtual ICollection<AcademicSurveySubject> Subjects { get; set; } = new List<AcademicSurveySubject>();
    }
}