using System.Collections.Generic;

namespace AcadEvalSys.Application.AcademicSurveys.Dtos;

public class AudienceResponsesDto
{
    public Guid SurveyId { get; set; }
    public Guid CareerId { get; set; }
    public int Year { get; set; }
    public IList<SubjectAudienceResultDto> Subjects { get; set; } = new List<SubjectAudienceResultDto>();
}

public class SubjectAudienceResultDto
{
    public Guid SurveySubjectId { get; set; }
    public Guid? SubjectId { get; set; }
    public string? SubjectName { get; set; }
    public string? ProfessorId { get; set; }
    public string? ProfessorName { get; set; }
    public IList<QuestionAggregateDto> Questions { get; set; } = new List<QuestionAggregateDto>();
}

public class QuestionAggregateDto
{
    public Guid QuestionId { get; set; }
    public string Text { get; set; } = string.Empty;
    public int TotalResponses { get; set; }
    public Dictionary<int, int> ScaleCount { get; set; } = new();
    public Dictionary<int, double> Percentage { get; set; } = new();
    public double? AverageSelectedValue { get; set; }
    public IList<string> OpenTexts { get; set; } = new List<string>();
}


