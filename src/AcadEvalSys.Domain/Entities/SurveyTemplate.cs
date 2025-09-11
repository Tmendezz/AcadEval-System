using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Domain.Entities
{
    public class SurveyTemplate : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public SurveyTemplateType SurveyType { get; set; }

        //Para borradores y trazabilidad         
        public bool IsDraft { get; set; } = true;
        public int Version { get; set; } = 1;

        //Concurrencia optimista
        public byte[]? RowVersion { get; set; }

        public virtual ICollection<SurveyTemplateQuestion> Questions { get; set; } = new List<SurveyTemplateQuestion>();

    }
}
