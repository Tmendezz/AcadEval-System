using System.Text.Json.Serialization;
using MediatR;

namespace AcadEvalSys.Application.Subjects.Commands.EnrollStudent;

public class EnrollStudentInSubjectCommand(Guid subjectId) : IRequest<bool>
{
    [JsonIgnore]
    public Guid SubjectId { get; set; } = subjectId;
    [JsonIgnore]
    public Guid TechnicalCareerId { get; set; }
    public string StudentId { get; set; } = string.Empty;
}