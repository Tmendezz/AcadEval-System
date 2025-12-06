using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Domain.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyAudienceResponses;

public class GetSurveyAudienceResponsesQueryHandler(
    ILogger<GetSurveyAudienceResponsesQueryHandler> logger,
    IAcademicSurveyRepository surveyRepository,
    IAcademicSurveyResponseRepository responseRepository
) : IRequestHandler<GetSurveyAudienceResponsesQuery, AudienceResponsesDto>
{
    public async Task<AudienceResponsesDto> Handle(GetSurveyAudienceResponsesQuery request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Analytics audiencia para encuesta {SurveyId} carrera {CareerId} año {Year}",
            request.SurveyId, request.CareerId, request.Year);

        var survey = await surveyRepository.GetSurveyWithSubjectsAsync(request.SurveyId, cancellationToken);
        if (survey == null)
        {
            throw new NotFoundException(nameof(AcademicSurvey), request.SurveyId.ToString());
        }

        var surveySubjects = await surveyRepository.GetAudienceSurveySubjectsAsync(
            request.SurveyId, request.CareerId, request.Year, cancellationToken);

        var dto = new AudienceResponsesDto
        {
            SurveyId = request.SurveyId,
            CareerId = request.CareerId,
            Year = (int)request.Year
        };

        var surveySubjectIds = surveySubjects.Select(ss => ss.Id).ToList();
        var responses = await responseRepository.GetResponsesBySurveySubjectsAsync(surveySubjectIds, cancellationToken);

        foreach (var ss in surveySubjects)
        {
            var subjectDto = new SubjectAudienceResultDto
            {
                SurveySubjectId = ss.Id,
                SubjectId = ss.SubjectId,
                SubjectName = ss.Subject?.Name,
                ProfessorId = ss.Subject?.ProfessorId,
                ProfessorName = ss.Subject?.Professor?.User?.Name
            };

            var ssResponses = responses
                .Where(r => r.AcademicSurveySubjectId == ss.Id)
                .SelectMany(r => r.QuestionResponses)
                .ToList();

            foreach (var question in survey.Questions)
            {
                var qDto = new QuestionAggregateDto
                {
                    QuestionId = question.Id,
                    Text = question.Text
                };

                var qResponses = ssResponses.Where(qr => qr.SurveyQuestionId == question.Id).ToList();
                qDto.TotalResponses = qResponses.Count;

                var counts = qResponses
                    .Where(qr => qr.SelectedValue.HasValue)
                    .GroupBy(qr => qr.SelectedValue!.Value)
                    .ToDictionary(g => g.Key, g => g.Count());

                qDto.ScaleCount = counts;
                var totalChoices = counts.Values.Sum(v => v);
                if (totalChoices > 0)
                {
                    qDto.Percentage = counts.ToDictionary(kv => kv.Key,
                        kv => Math.Round((double)kv.Value / totalChoices * 100, 2));
                    qDto.AverageSelectedValue = Math.Round(counts.Sum(kv => kv.Key * kv.Value) / (double)totalChoices, 2);
                }

                var openTexts = qResponses
                    .Where(qr => !string.IsNullOrWhiteSpace(qr.Text))
                    .Select(qr => qr.Text!)
                    .ToList();
                if (openTexts.Any()) qDto.OpenTexts = openTexts;

                subjectDto.Questions.Add(qDto);
            }

            dto.Subjects.Add(subjectDto);
        }

        return dto;
    }
}


