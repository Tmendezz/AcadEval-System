namespace AcadEvalSys.Application.TechnicalCareers.Dtos;

public record TechnicalCareerDto
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
}