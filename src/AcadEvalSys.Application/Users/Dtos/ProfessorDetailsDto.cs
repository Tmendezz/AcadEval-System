using AcadEvalSys.Application.Subjects.Dtos;

namespace AcadEvalSys.Application.Users.Dtos;

public record ProfessorDetailsDto
{
    public string? Phone { get; set; }
    public IEnumerable<SubjectDto> Subjects { get; set; }
} 