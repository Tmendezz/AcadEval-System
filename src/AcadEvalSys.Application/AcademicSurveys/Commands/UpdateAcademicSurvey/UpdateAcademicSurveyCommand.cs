using MediatR;
using System.ComponentModel.DataAnnotations;

namespace AcadEvalSys.Application.AcademicSurveys.Commands.UpdateAcademicSurvey;

public class UpdateAcademicSurveyCommand : IRequest
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    public string Title { get; set; } = string.Empty;
    public DateTime? PublishAt { get; set; }
    public DateTime? CloseAt { get; set; }
    public List<SurveyAudienceItem> Audience { get; set; } = new();
}

public class SurveyAudienceItem
{
    [Required]
    public Guid TechnicalCareerId { get; set; }
    [Required]
    public List<string> SelectedYears { get; set; } = new();
}


