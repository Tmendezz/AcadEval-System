using AcadEvalSys.Domain.Enums;

namespace   AcadEvalSys.Application.AcademicSurveysResponses.Dtos;

public class SurveyQuestionForResponseDto
{
    public Guid Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public QuestionType Type { get; set; }
    public bool IsRequired { get; set; }
    public bool AllowComment { get; set; }

    public List<SurveyQuestionOptionForResponseDto> Options { get; set; } = new();
}
