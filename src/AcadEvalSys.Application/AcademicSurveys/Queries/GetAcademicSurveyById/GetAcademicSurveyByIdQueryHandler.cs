using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetAcademicSurveyById;

public class GetAcademicSurveyByIdQueryHandler (
    ILogger<GetAcademicSurveyByIdQueryHandler> logger, 
    IAcademicSurveyRepository academicSurveyRepository,
    IMapper mapper
    ) :  IRequestHandler<GetAcademicSurveyByIdQuery, AcademicSurveyDto>
{
    public async Task<AcademicSurveyDto> Handle(GetAcademicSurveyByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Retrieving academic survey with ID: {Id}", request.Id);

        var survey = await academicSurveyRepository.GetByIdAsync(request.Id);
        
        if (survey is null)
        {
            throw new NotFoundException(nameof(AcademicSurvey), request.Id.ToString());
        }
        
        logger.LogInformation("Retrieved academic survey with ID: {Id}", request.Id);

        return mapper.Map<AcademicSurveyDto>(survey);
    }
}