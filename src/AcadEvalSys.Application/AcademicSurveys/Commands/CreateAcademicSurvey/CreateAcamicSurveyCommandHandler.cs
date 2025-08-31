using AcadEvalSys.Domain.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CreateAcademicSurvey
{
    public class CreateAcademicSurveyCommandHandler(IAcademicSurveyRepository repository)
    : IRequestHandler<CreateAcademicSurveyCommand, Guid>
    {
        public async Task<Guid> Handle(CreateAcademicSurveyCommand request, CancellationToken cancellationToken)
        {
            var id = await repository.CreateFromTemplateAsync(request.Title, request.TemplateId, request.PublishAt, request.CloseAt, null, cancellationToken);
            return id;
        }
    }
}
