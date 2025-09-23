using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Domain.Enums;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetAllAcademicSurveys;

public class GetAllAcademicSurveysQuery (SurveyStatus? status, string? search) : IRequest<IEnumerable<AcademicSurveyDto>>
{
    public SurveyStatus? Status { get; set; } = status;
    public string? SearchString { get; set; } = search;
}