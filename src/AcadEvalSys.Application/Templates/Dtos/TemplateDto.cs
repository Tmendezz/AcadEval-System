using AcadEvalSys.Domain.Entities;

namespace AcadEvalSys.Application.Templates.Dtos
{
    public class TemplateDto
    {
        public string Name { get; set; }
        public List<SurveyTemplateQuestion> TemplateQuestions { get; set; } = new();
    }
}
