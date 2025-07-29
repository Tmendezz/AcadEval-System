namespace AcadEvalSys.Application.TechnicalCareers.Dtos;

public record TechnicalCareerDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public int TotalStudents { get; set; } = 0;
    public int TotalProfessors { get; set; } = 0;
}