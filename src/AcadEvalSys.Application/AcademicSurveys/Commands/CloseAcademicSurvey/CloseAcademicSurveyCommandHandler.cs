using AcadEvalSys.Domain.Repositories;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CloseAcademicSurvey
{
    public class CloseAcademicSurveyCommandHandler(IAcademicSurveyRepository repository)
        : IRequestHandler<CloseAcademicSurveyCommand>
    {
        public async Task Handle(CloseAcademicSurveyCommand request, CancellationToken cancellationToken)
        {
            await repository.CloseAsync(request.SurveyId, request.CloseAt, cancellationToken);
        }
    }
}
