using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Templates.Dtos
{
    //Dto pensado apra leer una plantilla individual y mostrarla completa.
    public class SurveyTemplateReadDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public SurveyType SurveyType { get; set; }
        public bool IsDraft { get; set; }
        public int Version { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public IEnumerable<SurveyTemplateQuestionDto> Questions { get; set; } = Enumerable.Empty<SurveyTemplateQuestionDto>();
    }
}
