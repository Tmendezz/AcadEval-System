using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Templates.Dtos
{
    //Dto pensado para listar varias plantillas en consultas.
    public class SurveyTemplateListItemDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int QuestionCount { get; set; }
        public SurveyType SurveyType { get; set; }
        public bool IsDraft { get; set; }
        public int Version { get; set; }
        public DateTime UpdatedAtOrCreatedAt { get; set; }
    }
}
