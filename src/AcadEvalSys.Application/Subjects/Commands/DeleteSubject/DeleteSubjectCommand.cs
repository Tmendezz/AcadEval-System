using MediatR;

namespace AcadEvalSys.Application.Subjects.Commands.DeleteSubject;

public class DeleteSubjectCommand(Guid id) : IRequest
{
    public Guid Id { get; set; } = id;
}