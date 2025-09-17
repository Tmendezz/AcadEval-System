using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveySubjectsByAudience;

public class GetSurveySubjectsByAudienceQueryHandler : IRequestHandler<GetSurveySubjectsByAudienceQuery, IEnumerable<SurveySubjectDto>>
{
    private readonly IAcademicSurveyRepository repository;
    private readonly IMapper mapper;

    public GetSurveySubjectsByAudienceQueryHandler(IAcademicSurveyRepository repository, IMapper mapper)
    {
        this.repository = repository;
        this.mapper = mapper;
    }

    public async Task<IEnumerable<SurveySubjectDto>> Handle(GetSurveySubjectsByAudienceQuery request, CancellationToken cancellationToken)
    {
        var subjects = await repository.GetSurveySubjectsByAudienceAsync(request.SurveyId, request.TechnicalCareerName, request.Year, cancellationToken);
        return subjects.Select(s => mapper.Map<SurveySubjectDto>(s)).ToList();
    }
}


