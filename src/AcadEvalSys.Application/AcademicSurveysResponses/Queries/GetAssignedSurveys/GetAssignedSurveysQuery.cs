using AcadEvalSys.Application.AcademicSurveysResponses.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Queries.GetAssignedSurveys;

public class GetAssignedSurveysQuery(string? status) : IRequest<IEnumerable<UserSurveyDto>>
{
    public string? Status { get; set; } = status;
}