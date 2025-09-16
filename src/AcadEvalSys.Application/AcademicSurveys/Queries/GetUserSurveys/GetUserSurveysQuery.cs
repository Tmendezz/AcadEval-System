using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetUserSurveys;

public class GetUserSurveysQuery : IRequest<IEnumerable<UserSurveyDto>>
{
    public string? Status { get; set; } // "pending", "completed", "all"
}

public class UserSurveyDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Status { get; set; }
    public DateTime PublishedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public bool Responded { get; set; }
    public DateTime? RespondedAt { get; set; }
    public int QuestionsCount { get; set; }
    public Guid? SurveySubjectId { get; set; } // ID de la relación encuesta-asignatura para responder
}