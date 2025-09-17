using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveyResponses
{
    public class GetSurveyResponsesQueryHandler(
        IAcademicSurveyRepository surveyRepository) : IRequestHandler<GetSurveyResponsesQuery, SurveyResponsesOverviewDto>
    {
        public async Task<SurveyResponsesOverviewDto> Handle(GetSurveyResponsesQuery request, CancellationToken ct)
        {
            var survey = await surveyRepository.GetByIdAsync(request.SurveyId, includeChildren: true, ct)
                ?? throw new KeyNotFoundException("Encuesta no encontrada.");

            var responses = await surveyRepository.GetResponsesBySurveyIdAsync(request.SurveyId, true, ct);

            var dto = new SurveyResponsesOverviewDto
            {
                SurveyId = survey.Id,
                Title = survey.Title,
                SubjectsCount = survey.Subjects.Count,
                TotalResponses = responses.Count,
                Responses = responses.Select(r => new SurveyUserResponseDto
                {
                    ResponseId = r.Id,
                    SurveySubjectId = r.AcademicSurveySubjectId ?? Guid.Empty,
                    UserId = r.UserId,
                    SubmittedAt = r.SubmittedAt,
                    Answers = r.QuestionResponses
                        .OrderBy(a => a.SurveyQuestion!.Order)
                        .Select(a => new SubmitSurveyAnswerDto
                        {
                            QuestionId = a.SurveyQuestionId,
                            
                            SelectedValue = a.SelectedValue,
                            Text = a.Text ?? string.Empty
                        }).ToList()
                }).ToList()
            };

            return dto;
        }
    }
}
