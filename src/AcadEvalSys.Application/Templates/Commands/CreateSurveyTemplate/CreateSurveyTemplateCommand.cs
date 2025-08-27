using AcadEvalSys.Application.Templates.Dtos;
using MediatR;

namespace AcadEvalSys.Application.Templates.Commands.CreateTemplate
{
    public class CreateSurveyTemplateCommand : IRequest<Guid>
    {
        public CreateSurveyTemplateDto Dto { get; set; } = default!;
        public string UserId { get; set; } = string.Empty;
    }
}
