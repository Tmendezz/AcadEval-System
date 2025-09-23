using AcadEvalSys.Application.AcademicSurveysResponses.Dtos;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Interfaces;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Queries.GetSurveySubjectsForUser;

public class GetSurveySubjectsForUserQueryHandler(
    IUserContext userContext,
    IAcademicSurveyResponseRepository repository
) : IRequestHandler<GetSurveySubjectsForUserQuery, IEnumerable<SurveySubjectForUserDto>>
{
    public async Task<IEnumerable<SurveySubjectForUserDto>> Handle(GetSurveySubjectsForUserQuery request, CancellationToken cancellationToken)
    {
        var user = userContext.GetCurrentUser();
        if (user == null || string.IsNullOrEmpty(user.Id))
            return Enumerable.Empty<SurveySubjectForUserDto>();

        var tuples = await repository.GetSurveySubjectsForUserAsync(request.SurveyId, user.Id, cancellationToken);

        return tuples.Select(t => new SurveySubjectForUserDto
        {
            SurveySubjectId = t.SurveySubjectId,
            SubjectId = t.SubjectId,
            SubjectName = t.SubjectName,
            ProfessorId = t.ProfessorId,
            ProfessorName = t.ProfessorName,
            QuestionsCount = t.QuestionsCount,
            HasResponded = t.HasResponded,
            CareerYear = t.CareerYear,
        }).ToList();
    }
}


