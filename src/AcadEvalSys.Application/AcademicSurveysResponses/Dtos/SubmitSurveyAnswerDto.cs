namespace AcadEvalSys.Application.AcademicSurveysResponses.Dtos;

public class SubmitSurveyAnswerDto
{
    public Guid QuestionId { get; set; }
    public int? SelectedValue { get; set; }
    public string? Text { get; set; }
}