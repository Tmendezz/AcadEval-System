using AcadEvalSys.Application.Subjects.Dtos;
using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Students.Dtos;

public class StudentDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? TechnicalCareerId { get; set; }
    public string? TechnicalCareerName { get; set; }
    public int CurrentYear { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public IEnumerable<SubjectDto> EnrolledSubjects { get; set; } = [];
} 