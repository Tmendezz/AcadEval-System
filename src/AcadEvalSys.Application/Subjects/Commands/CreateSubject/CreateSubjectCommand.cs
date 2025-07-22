using AcadEvalSys.Domain.Enums;
using MediatR;

namespace AcadEvalSys.Application.Subjects.Commands.CreateSubject;

public class CreateSubjectCommand : IRequest<Guid>
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid TechnicalCareerId { get; set; }
    public CareerYear Year { get; set; }
    public string ProfessorId { get; set; } = string.Empty;
}