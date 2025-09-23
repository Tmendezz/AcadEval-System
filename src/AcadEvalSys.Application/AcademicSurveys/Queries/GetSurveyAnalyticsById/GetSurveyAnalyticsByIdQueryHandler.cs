using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyAnalyticsById;

public class GetSurveyAnalyticsByIdQueryHandler(
    ILogger<GetSurveyAnalyticsByIdQueryHandler> logger,
    IAcademicSurveyRepository surveyRepository,
    IAcademicSurveyResponseRepository responseRepository
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

        var dto = new SurveyAnalyticsDto
        {
            Id = survey.Id,
            Title = survey.Title,
            Description = survey.Description,
            Status = survey.Status,
            PublishAt = survey.PublishAt,
            CloseAt = survey.CloseAt,
            CreatedAt = survey.CreatedAt,
            SurveyType = survey.SurveyType,
        };

        dto.TotalQuestions = survey.Questions.Count;

        var byCareer = survey.Subjects
            .Where(ss => ss.SubjectId != null && ss.Subject != null)
            .GroupBy(ss => ss.Subject!.TechnicalCareerId);

        foreach (var careerGroup in byCareer)
        {
            var careerId = careerGroup.Key ?? Guid.Empty;
            var careerName = careerGroup.First().Subject!.TechnicalCareer?.Name ?? string.Empty;

            var careerDto = new CareerAnalyticsDto
            {
                TechnicalCareerId = careerId,
                CareerName = careerName,
            };

            var byYear = careerGroup.GroupBy(ss => ss.Subject!.Year);
            foreach (var yearGroup in byYear)
            {
                var surveySubjectIds = yearGroup.Select(ss => ss.Id).ToList();

                var subjectsCount = yearGroup.Count();
                var studentsCount = yearGroup.Sum(ss => (ss.Subject!.StudentSubjects?.Count ?? 0));
                var professorsCount = yearGroup.Count(ss => !string.IsNullOrEmpty(ss.Subject!.ProfessorId));

                var responsesCount = await responseRepository.CountResponsesBySurveySubjectsAsync(surveySubjectIds, cancellationToken);

                var yearDto = new YearAnalyticsDto
                {
                    Year = yearGroup.Key,
                    YearName = yearGroup.Key.ToString(),
                    SubjectsCount = subjectsCount,
                    StudentsCount = studentsCount,
                    ProfessorsCount = professorsCount,
                    ResponsesCount = responsesCount,
                    ResponseRate = studentsCount > 0 ? Math.Round((double)responsesCount / studentsCount * 100, 2) : 0
                };

                dto.TotalResponses += responsesCount;

                careerDto.YearBreakdown.Add(yearDto);
            }

            dto.CareerAnalytics.Add(careerDto);
        }

        dto.TotalAudiences = survey.Subjects.Count;
        var totalStudents = survey.Subjects.Sum(ss => ss.Subject!.StudentSubjects?.Count ?? 0);
        dto.ResponseRate = totalStudents > 0 ? Math.Round((double)dto.TotalResponses / totalStudents * 100, 2) : 0;

        return dto;
    }
}


