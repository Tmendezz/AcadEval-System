namespace  AcadEvalSys.Application.AcademicSurveysResponses.Dtos;

public class SurveyQuestionOptionForResponseDto
{
    public Guid Id { get; set; }
    public int Value { get; set; }
    public string Text { get; set; } = string.Empty;
    public bool AllowOpenText { get; set; }
}