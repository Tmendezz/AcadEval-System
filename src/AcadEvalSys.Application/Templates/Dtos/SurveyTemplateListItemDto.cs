using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Templates.Dtos
{
    //Dto pensado para listar varias plantillas en consultas.
    public class SurveyTemplateListItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public SurveyTemplateType SurveyType { get; set; }
        public bool IsDraft { get; set; }
        public int Version { get; set; }
        public DateTime UpdatedAtOrCreatedAt { get; set; }
    }
}
