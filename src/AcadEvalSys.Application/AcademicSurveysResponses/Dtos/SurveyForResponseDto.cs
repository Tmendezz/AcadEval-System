
namespace AcadEvalSys.Application.AcademicSurveysResponses.Dtos;

public class SurveyForResponseDto
{
    public Guid SurveyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<SurveyQuestionForResponseDto> Questions { get; set; } = new();
}