using MediatR;

namespace AcadEvalSys.Application.Templates.Commands.DeleteTemplate
{
    public class DeleteSurveyTemplateCommand : IRequest
    {
        public Guid Id { get; set; }
    }
}
