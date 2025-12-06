using AcadEvalSys.Application.AcademicSurveys.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetAcademicSurveyById;

public class GetAcademicSurveyByIdQuery(Guid id)  : IRequest<AcademicSurveyDto>
{
    public Guid Id { get; set; } = id;
}