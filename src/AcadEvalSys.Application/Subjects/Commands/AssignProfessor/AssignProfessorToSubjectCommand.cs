using System.Text.Json.Serialization;
using MediatR;

namespace AcadEvalSys.Application.Subjects.Commands.AssignProfessor;

public class AssignProfessorToSubjectCommand(Guid subjectId) : IRequest<bool>
{
    [JsonIgnore]
    public Guid SubjectId { get; set; } = subjectId;
    [JsonIgnore]
    public Guid TechnicalCareerId { get; set; }
    public string ProfessorId { get; set; } = string.Empty;
}