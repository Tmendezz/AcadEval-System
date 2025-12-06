using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Domain.Interfaces;
using MediatR;
using AutoMapper;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyAnalyticsById;

public class GetSurveyAnalyticsByIdQueryHandler(
    ILogger<GetSurveyAnalyticsByIdQueryHandler> logger,
    IAcademicSurveyRepository surveyRepository,
    IAcademicSurveyResponseRepository responseRepository,
    IMapper mapper
) : IRequestHandler<GetSurveyAnalyticsByIdQuery, SurveyAnalyticsDto>
{
    public async Task<SurveyAnalyticsDto> Handle(GetSurveyAnalyticsByIdQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Analytics summary para encuesta {SurveyId}", request.SurveyId);

        var survey = await surveyRepository.GetSurveyWithSubjectsAsync(request.SurveyId, cancellationToken);
        if (survey == null)
        {
            throw new NotFoundException(nameof(AcademicSurvey), request.SurveyId.ToString());
        }

        var dto = mapper.Map<SurveyAnalyticsDto>(survey);

        // Completar respuestas y tasas usando los IDs ya agrupados por el perfil
        foreach (var career in dto.CareerAnalytics)
        {
            // Obtener los grupos originales desde la entidad para extraer ids por carrera y año
            var careerGroup = survey.Subjects
                .Where(ss => ss.SubjectId != null && ss.Subject != null && ss.Subject!.TechnicalCareerId == career.TechnicalCareerId)
                .GroupBy(ss => ss.Subject!.Year)
                .ToDictionary(g => g.Key, g => g.Select(ss => ss).ToList());

            foreach (var yearDto in career.CareerYear)
            {
                if (!careerGroup.TryGetValue(yearDto.Year, out var yearGroup))
                    continue;

                var surveySubjectIds = yearGroup.Select(ss => ss.Id).ToList();
                var responsesCount = await responseRepository.CountResponsesBySurveySubjectsAsync(surveySubjectIds, cancellationToken);

                yearDto.ResponsesCount = responsesCount;

                var audienceForYear = survey.SurveyType == SurveyType.Student ? yearDto.StudentsCount : yearDto.ProfessorsCount;
                yearDto.ResponseRate = audienceForYear > 0 ? Math.Round((double)responsesCount / audienceForYear * 100, 2) : 0;

                dto.TotalResponses += responsesCount;
            }
        }

        // Audience: expected respondents
        if (survey.SurveyType == SurveyType.Student)
        {
            var totalStudents = survey.Subjects
                .Where(ss => ss.Subject != null)
                .Sum(ss => ss.Subject!.StudentSubjects?.Count ?? 0);
            dto.TotalAudiences = totalStudents;
            dto.ResponseRate = totalStudents > 0 ? Math.Round((double)dto.TotalResponses / totalStudents * 100, 2) : 0;
        }
        else // SurveyType.Professor
        {
            var totalDistinctProfessors = survey.Subjects
                .Where(ss => ss.Subject != null && !string.IsNullOrEmpty(ss.Subject!.ProfessorId))
                .Select(ss => ss.Subject!.ProfessorId)
                .Distinct()
                .Count();
            dto.TotalAudiences = totalDistinctProfessors;
            dto.ResponseRate = totalDistinctProfessors > 0 ? Math.Round((double)dto.TotalResponses / totalDistinctProfessors * 100, 2) : 0;
        }

        return dto;
    }
}


