namespace AcadEvalSys.Application.Students.Importing;

public class ImportStudentRecord
{
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string CurrentYear { get; set; } = "First"; // Default to First year
    public string? Password { get; set; }
}
