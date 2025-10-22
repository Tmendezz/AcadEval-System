using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CloseAcademicSurvey
{
    public class CloseAcademicSurveyCommand(Guid surveyId, bool force) : IRequest
    {
        public Guid SurveyId { get; set; } = surveyId;
        public bool Force { get; set; } = force;
    }
}
