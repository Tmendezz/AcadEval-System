namespace AcadEvalSys.Application.AcademicSurveysResponses.Dtos;

public class SubmitSurveySubjectAnswersDto
{
    public Guid SurveySubjectId { get; set; }
    public IList<SubmitSurveyAnswerDto> Answers { get; set; } = new List<SubmitSurveyAnswerDto>();
}
public class SubmitSurveyAnswerDto
{
    public Guid QuestionId { get; set; }
    public int? SelectedValue { get; set; }
    public string? Text { get; set; }
}

