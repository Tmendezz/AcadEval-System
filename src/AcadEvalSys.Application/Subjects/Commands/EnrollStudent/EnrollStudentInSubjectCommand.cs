using System.Text.Json.Serialization;
using MediatR;

namespace AcadEvalSys.Application.Subjects.Commands.EnrollStudent;

public class EnrollStudentInSubjectCommand(Guid subjectId) : IRequest<bool>
{
    [JsonIgnore]
    public Guid SubjectId { get; set; } = subjectId;
    public string StudentId { get; set; } = string.Empty;
}