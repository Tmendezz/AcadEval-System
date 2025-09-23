using AcadEvalSys.Application.AcademicSurveysResponses.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Queries.GetAssignedSurveys;

public class GetAssignedSurveysQuery(string? status, bool? completed = null) : IRequest<IEnumerable<UserSurveyDto>>
{
    public string? Status { get; set; } = status;
    public bool? Completed { get; set; } = completed;
}