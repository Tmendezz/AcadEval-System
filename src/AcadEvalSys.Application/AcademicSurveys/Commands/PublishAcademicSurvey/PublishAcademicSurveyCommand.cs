using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.PublishAcademicSurvey
{
    public class PublishAcademicSurveyCommand : IRequest
    {
        public Guid SurveyId { get; set; }
        public DateTime? PublishAt { get; set; }
    }
}
