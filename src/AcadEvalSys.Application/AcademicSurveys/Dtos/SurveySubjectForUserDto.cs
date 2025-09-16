namespace AcadEvalSys.Application.AcademicSurveys.Dtos;

public class SurveySubjectForUserDto
{
    public Guid SurveySubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string ProfessorName { get; set; } = string.Empty;
    public bool HasResponded { get; set; }
    public DateTime? RespondedAt { get; set; }
    public int QuestionsCount { get; set; }
}
