using System.Text.Json.Serialization;
using MediatR;

namespace AcadEvalSys.Application.Subjects.Commands.DeleteSubject;

public class DeleteSubjectCommand(Guid id, Guid technicalCareerId) : IRequest
{
    [JsonIgnore]
    public Guid Id { get; set; } = id;
    [JsonIgnore]
    public Guid TechnicalCareerId { get; set; } = technicalCareerId;
}