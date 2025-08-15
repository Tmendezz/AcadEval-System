using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    public class AcademicSurvey : BaseEntity
    {
        public string Title { get; set; } = string.Empty;


        // Programación y estado
        public DateTime? PublishAt { get; set; }
        public DateTime? CloseAt { get; set; }
        public SurveyStatus Status { get; set; } = SurveyStatus.Draft;
    }
}
