using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.SetSurveySubjects
{
    public class SetSurveySubjectsCommand : IRequest
    {
        public Guid SurveyId { get; set; }
        public IReadOnlyList<Guid> SubjectIds { get; set; }

    }
}
