using MediatR;
using System.ComponentModel.DataAnnotations;
using AcadEvalSys.Application.AcademicSurveys.Dtos;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.UpdateAcademicSurvey;

public class UpdateAcademicSurveyCommand : IRequest
{
    [Required]
    public Guid Id { get; set; }
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public DateTime? PublishAt { get; set; }
    public DateTime? CloseAt { get; set; }
    public List<CreateSurveyAudienceDto>? Audience { get; set; } = new();
    public List<SurveyQuestionDto>? Questions { get; set; } = new();
}



