using AcadEvalSys.Domain.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.PublishAcademicSurvey
{
    public class PublishAcademicSurveyCommandHandler(IAcademicSurveyRepository repository)
        : IRequestHandler<PublishAcademicSurveyCommand>
    {
        public async Task Handle(PublishAcademicSurveyCommand request, CancellationToken cancellationToken)
        {
            await repository.PublishAsync(request.SurveyId, request.PublishAt, cancellationToken);
        }
    }
}
