using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetAcademicSurvey
{
    public class GetAcademicSurveyByIdQueryHandler(IAcademicSurveyRepository repository, IMapper mapper)
        : IRequestHandler<GetAcademicSurveyByIdQuery, AcademicSurveyDetailDto?>
    {
        public async Task<AcademicSurveyDetailDto?> Handle(GetAcademicSurveyByIdQuery request, CancellationToken cancellationToken)
        {
            var survey = await repository.GetByIdAsync(request.Id, includeChildren: true, cancellationToken);
            return survey is null ? null : mapper.Map<AcademicSurveyDetailDto>(survey);
        }
    }
}
