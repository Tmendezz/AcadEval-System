using AcadEvalSys.Application.Subjects.Dtos;

namespace AcadEvalSys.Application.Professors.Dtos;

public class ProfessorDto
{
    public string UserId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public IEnumerable<SubjectDto> Subjects { get; set; } = [];
}
