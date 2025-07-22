using System.Text.Json.Serialization;
using AcadEvalSys.Domain.Enums;
using MediatR;

namespace AcadEvalSys.Application.Subjects.Commands.UpdateSubject;

public class UpdateSubjectCommand(Guid id) : IRequest
{
    [JsonIgnore]
    public Guid Id { get; set; } = id;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid TechnicalCareerId { get; set; }
    public CareerYear Year { get; set; }
    public string ProfessorId { get; set; } = string.Empty;
}