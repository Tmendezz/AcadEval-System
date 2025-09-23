using System.Text.Json.Serialization;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.PublishAcademicSurvey
{
    public class PublishAcademicSurveyCommand() : IRequest
    {
        [JsonIgnore]
        public Guid SurveyId { get; set; }
        public DateTime? CloseAt { get; set; }
        public bool Reopen { get; set; }
    }
}

