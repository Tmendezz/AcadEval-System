namespace AcadEvalSys.Application.Evaluations.Dtos;

public class CompetencyAssignmentByCareerYearDto
{
    public string CareerName { get; set; }
    public Guid CareerId { get; set; }
    public Dictionary<string, CompetencyAssignmentDto[]> Assignments { get; set; } = [];
}