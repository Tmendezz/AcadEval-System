using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Repositories;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveySubjectResponses
{
    public class GetSurveySubjectResponsesQueryHandler(
        IAcademicSurveyRepository surveyRepository) : IRequestHandler<GetSurveySubjectResponsesQuery, SurveySubjectResponsesDto>
    {
        public async Task<SurveySubjectResponsesDto> Handle(GetSurveySubjectResponsesQuery request, CancellationToken ct)
        {
            var subject = await surveyRepository.GetSubjectGraphAsync(request.SurveySubjectId, ct)
                ?? throw new KeyNotFoundException("SurveySubject no encontrado.");

            var responses = await surveyRepository.GetResponsesBySurveySubjectIdAsync(request.SurveySubjectId, true, ct);

            return new SurveySubjectResponsesDto
            {
                SurveySubjectId = subject.Id,
                SurveyId = subject.AcademicSurveyId,
                SubjectName = subject.Subject?.Name,
                ResponsesCount = responses.Count,
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
        }
    }
}
