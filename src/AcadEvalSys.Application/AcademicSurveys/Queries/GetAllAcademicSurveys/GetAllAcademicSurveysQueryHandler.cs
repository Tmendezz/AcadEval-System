using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetAllAcademicSurveys;

public class GetAllAcademicSurveysQueryHandler
(
    ILogger<GetAllAcademicSurveysQueryHandler> logger, 
    IAcademicSurveyRepository academicSurveyRepository,
    IMapper mapper): IRequestHandler<GetAllAcademicSurveysQuery, IEnumerable<AcademicSurveyDto>>
{
    public async Task<IEnumerable<AcademicSurveyDto>> Handle(GetAllAcademicSurveysQuery request, CancellationToken cancellationToken)
    {
        var surveys = await academicSurveyRepository.GetAllAsync(
            status: request.Status,
            search: request.SearchString,
            ct: cancellationToken);

        logger.LogInformation("Retrieving surveys: {Count} founded.", surveys.Count);

        return mapper.Map<IEnumerable<AcademicSurveyDto>>(surveys);
    }
}