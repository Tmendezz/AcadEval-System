using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Repositories;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetAudienceResponses;

public class GetAudienceResponsesQueryHandler : IRequestHandler<GetAudienceResponsesQuery, AudienceResponsesDto>
{
    private readonly IAcademicSurveyRepository repository;

    public GetAudienceResponsesQueryHandler(IAcademicSurveyRepository repository)
    {
        this.repository = repository;
    }

    public async Task<AudienceResponsesDto> Handle(GetAudienceResponsesQuery request, CancellationToken cancellationToken)
    {
        var responses = await repository.GetResponsesBySurveyAndAudienceAsync(request.SurveyId, request.CareerId, request.Year, "Student", cancellationToken);

        // Agrupar por SurveySubjectId -> QuestionId
        var subjectGroups = responses
            .GroupBy(r => r.AcademicSurveySubjectId!.Value)
            .ToDictionary(g => g.Key, g => g.SelectMany(r => r.QuestionResponses));

        var result = new AudienceResponsesDto
        {
            SurveyId = request.SurveyId,
            CareerId = request.CareerId,
            Year = request.Year
        };

        foreach (var (surveySubjectId, questionResponses) in subjectGroups)
        {
            var subjectDto = new SubjectAudienceResultDto { SurveySubjectId = surveySubjectId };

            // Enriquecer con Subject y Professor
            var subject = await repository.GetSubjectGraphAsync(surveySubjectId, cancellationToken);
            subjectDto.SubjectId = subject?.SubjectId;
            subjectDto.SubjectName = subject?.Subject?.Name;
            subjectDto.ProfessorId = subject?.Subject?.ProfessorId;
            subjectDto.ProfessorName = subject?.Subject?.Professor?.User?.Name;

            var byQuestion = questionResponses
                .Where(qr => qr.SurveyQuestion != null)
                .GroupBy(qr => qr.SurveyQuestionId)
                .ToList();

            foreach (var qg in byQuestion)
            {
                var qrList = qg.ToList();
                var dto = new QuestionAggregateDto
                {
                    QuestionId = qg.Key,
                    Text = qrList.First().SurveyQuestion!.Text,
                    TotalResponses = qrList.Count
                };

                // Contar valores seleccionados
                foreach (var qr in qrList)
                {
                    if (qr.SelectedValue.HasValue)
                    {
                        var v = qr.SelectedValue.Value;
                        dto.ScaleCount[v] = dto.ScaleCount.TryGetValue(v, out var c) ? c + 1 : 1;
                    }
                    if (!string.IsNullOrWhiteSpace(qr.Text))
                    {
                        dto.OpenTexts.Add(qr.Text);
                    }
                }

                // Promedio y porcentaje
                if (dto.ScaleCount.Count > 0)
                {
                    var sum = dto.ScaleCount.Sum(kv => kv.Key * kv.Value);
                    dto.AverageSelectedValue = dto.TotalResponses > 0 ? (double)sum / dto.TotalResponses : null;
                    foreach (var (val, cnt) in dto.ScaleCount)
                    {
                        dto.Percentage[val] = dto.TotalResponses > 0 ? (cnt * 100.0) / dto.TotalResponses : 0;
                    }
                }

                subjectDto.Questions.Add(dto);
            }

            result.Subjects.Add(subjectDto);
        }

        return result;
    }
}


