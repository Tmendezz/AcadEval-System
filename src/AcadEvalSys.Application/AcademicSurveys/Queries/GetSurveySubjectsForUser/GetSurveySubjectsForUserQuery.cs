using AcadEvalSys.Application.AcademicSurveys.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetSurveySubjectsForUser;

public class GetSurveySubjectsForUserQuery : IRequest<IEnumerable<SurveySubjectForUserDto>>
{
    public Guid SurveyId { get; set; }
}
