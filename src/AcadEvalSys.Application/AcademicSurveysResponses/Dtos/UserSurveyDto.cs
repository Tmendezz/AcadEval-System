using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;

namespace  AcadEvalSys.Application.AcademicSurveysResponses.Dtos;

public class UserSurveyDto
{
    public Guid SurveyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public DateTime? PublishAt { get; set; }
    public DateTime? CloseAt { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? SubmittedAt { get; set; }
    public SurveyStatus Status { get; set; } 
}
