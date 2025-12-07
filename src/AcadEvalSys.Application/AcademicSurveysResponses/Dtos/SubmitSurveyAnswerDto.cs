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
    /// <summary>
    /// Valores seleccionados para preguntas de opción múltiple. Si se proporciona, se almacenará en Text como JSON.
    /// </summary>
    public IList<int>? SelectedValues { get; set; }
}

