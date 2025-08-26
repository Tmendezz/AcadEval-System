namespace AcadEvalSys.Application.TechnicalCareers.Commands.RevokeExpiredEnrollments;

public class RevokeExpiredEnrollmentsResult
{
    public int RevokedCount { get; set; }
    public int AcademicYear { get; set; }
    public DateTime ProcessedAt { get; set; }
}
