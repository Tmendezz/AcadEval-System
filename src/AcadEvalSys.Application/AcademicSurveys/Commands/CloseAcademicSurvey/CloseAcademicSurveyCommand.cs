using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.CloseAcademicSurvey
{
    public class CloseAcademicSurveyCommand : IRequest
    {
        public Guid SurveyId { get; set; }
        public DateTime? CloseAt { get; set; }
    }
}
