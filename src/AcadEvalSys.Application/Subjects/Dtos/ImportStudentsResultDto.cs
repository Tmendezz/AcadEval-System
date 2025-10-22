namespace AcadEvalSys.Application.Subjects.Dtos;

public class ImportStudentsResultDto
{
    public int UsersCreated { get; set; }
    public int StudentsEnrolled { get; set; }
    public int StudentsAlreadyEnrolled { get; set; }
    public List<string> Errors { get; set; } = new();
    public List<GeneratedPasswordDto> GeneratedPasswords { get; set; } = new();
}

public class GeneratedPasswordDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class StudentImportRecord
{
    public required string Email { get; set; }
    public required string Name { get; set; }
    public string? Password { get; set; }
}
