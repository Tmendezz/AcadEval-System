using AcadEvalSys.Application.AcademicSurveysResponses.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Queries.GetSurveyDetail;

public class GetSurveyDetailQuery(Guid surveyId, bool readOnly = false) : IRequest<SurveyForResponseDto?>
{
    public Guid SurveyId { get; set; } = surveyId;
    public bool ReadOnly { get; set; } = readOnly;
}
