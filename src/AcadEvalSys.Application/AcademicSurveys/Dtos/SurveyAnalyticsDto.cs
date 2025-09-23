using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.AcademicSurveys.Dtos;

public class SurveyAnalyticsDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public SurveyStatus Status { get; set; }
    public DateTime? PublishAt { get; set; }
    public DateTime? CloseAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CreatedByUserName { get; set; } = string.Empty;
    public int TotalQuestions { get; set; }
    public int TotalAudiences { get; set; }
    public int TotalResponses { get; set; }
    public SurveyType SurveyType { get; set; }
    public double ResponseRate { get; set; }
    public List<CareerAnalyticsDto> CareerAnalytics { get; set; } = new();
}

public class CareerAnalyticsDto
{
    public Guid TechnicalCareerId { get; set; }
    public string CareerName { get; set; } = string.Empty;
    public List<YearAnalyticsDto> YearBreakdown { get; set; } = new();
}

public class YearAnalyticsDto
{
    public CareerYear Year { get; set; }
    public string YearName { get; set; } = string.Empty;
    public int SubjectsCount { get; set; }
    public int StudentsCount { get; set; }
    public int ProfessorsCount { get; set; }
    public int ResponsesCount { get; set; }
    public double ResponseRate { get; set; }
}
