namespace AcadEvalSys.Application.AcademicSurveysResponses.Dtos;

public class SurveySubjectForUserDto
{
    public Guid SurveySubjectId { get; set; }
    public string CareerYear { get; set; } = string.Empty;
    public Guid? SubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string? ProfessorId { get; set; }
    public string ProfessorName { get; set; } = string.Empty;
    public int QuestionsCount { get; set; }
    public bool HasResponded { get; set; }
}


