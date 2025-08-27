using AcadEvalSys.Application.Templates.Dtos;
using MediatR;

namespace AcadEvalSys.Application.Templates.Queries.GetTemplateById
{
    public class GetSurveyTemplateByIdQuery(Guid id) : IRequest<SurveyTemplateReadDto>
    {
        public Guid Id { get; } = id;
    }
}