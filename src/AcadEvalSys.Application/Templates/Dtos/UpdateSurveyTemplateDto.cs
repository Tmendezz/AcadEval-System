using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Templates.Dtos
{
    public class UpdateSurveyTemplateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public SurveyTemplateType SurveyType { get; set; }
        public bool IsDraft { get; set; }
        public byte[]? RowVersion { get; set; }
        public List<SurveyTemplateQuestionDto> Questions { get; set; } = new();
    }
}
