using AcadEvalSys.Application.AcademicSurveys.Dtos;
using AcadEvalSys.Application.AcademicSurveysResponses.Dtos;
using MediatR;
using System.Text.Json.Serialization;

namespace AcadEvalSys.Application.AcademicSurveysResponses.Commands.SubmitSurveyResponse
{
    public class SubmitSurveyResponseCommand : IRequest<Guid> 
    {
        [JsonIgnore]
        public Guid SurveyId { get; set; }

        // Asignatura (survey-subject) objetivo de este envío
        public Guid SurveySubjectId { get; set; }

        // Respuestas para esa asignatura
        public IList<SubmitSurveyAnswerDto>? SubjectAnswers { get; set; }

    }
}
