using AcadEvalSys.Application.Subjects.Dtos;

namespace AcadEvalSys.Application.Users.Dtos;

public class StudentDetailsDto
{
    public IEnumerable<SubjectDto> Subjects { get; set; }
}