using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Templates.Dtos
{
    public class UpdateSurveyTemplateDto
    {
        public string Name { get; set; } = string.Empty;
        public SurveyTemplateType SurveyType { get; set; }
        public bool IsDraft { get; set; }
        public byte[]? RowVersion { get; set; }
        public List<SurveyTemplateQuestionDto> Questions { get; set; } = new();
    }
}
