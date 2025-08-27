using AcadEvalSys.Application.Templates.Dtos;
using AcadEvalSys.Domain.Enums;
using MediatR;

namespace AcadEvalSys.Application.Templates.Queries.GetTemplates
{
    public class GetSurveyTemplatesQuery : IRequest<IEnumerable<SurveyTemplateListItemDto>>
    {
        public SurveyTemplateType? SurveyType { get; set; }
        public bool? IsDraft { get; set; }
        public string? SearchTerm { get; set; }
    }
}