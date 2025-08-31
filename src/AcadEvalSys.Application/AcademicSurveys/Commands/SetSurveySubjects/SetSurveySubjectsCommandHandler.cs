using AcadEvalSys.Domain.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.SetSurveySubjects
{
    public class SetSurveySubjectsCommandHandler(IAcademicSurveyRepository repository)
        : IRequestHandler<SetSurveySubjectsCommand>
    {
        public async Task Handle(SetSurveySubjectsCommand request, CancellationToken cancellationToken)
        {
            await repository.SetSubjectsAsync(request.SurveyId, request.SubjectIds, null, cancellationToken);
        }
    }
}
