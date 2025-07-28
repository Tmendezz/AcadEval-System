using System.Text.Json.Serialization;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Subjects.Dtos;

public record SubjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public CareerYear Year { get; set; }
    public string? TechnicalCareer { get; set; }
    public Guid? TechnicalCareerId { get; set; }
    public string? ProfessorName { get; set; }
    public string? ProfessorId { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<EnrolledStudentDto>? EnrolledStudents { get; set; }
}

public record EnrolledStudentDto
{
    public string StudentId { get; set; } = string.Empty;
    public string StudentName { get; set; } = string.Empty;
    public string StudentEmail { get; set; } = string.Empty;
}