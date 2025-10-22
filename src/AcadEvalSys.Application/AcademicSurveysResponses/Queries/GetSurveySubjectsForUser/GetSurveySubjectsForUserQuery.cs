using AcadEvalSys.Application.AcademicSurveysResponses.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Queries.GetSurveySubjectsForUser;

public class GetSurveySubjectsForUserQuery(Guid surveyId) : IRequest<IEnumerable<SurveySubjectForUserDto>>
{
    public Guid SurveyId { get; set; } = surveyId;
}


