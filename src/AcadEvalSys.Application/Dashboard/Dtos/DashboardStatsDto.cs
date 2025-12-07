namespace AcadEvalSys.Application.Dashboard.Dtos;

public class DashboardStatsDto
{
    public int StudentsCount { get; set; }
    public int ProfessorsCount { get; set; }
    public int CareersCount { get; set; }
    public int EvaluationsInProgressCount { get; set; }
    public int TotalEvaluations { get; set; }
    public int CompletedEvaluations { get; set; }
    public int SurveysInProgressCount { get; set; }
    public List<ActivityItemDto> RecentActivity { get; set; } = new();
}

public class ActivityItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string UserId { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
}

