using MediatR;

namespace AcadEvalSys.Application.Subjects.Commands.AssignProfessor;

public class AssignProfessorToSubjectCommand(Guid subjectId) : IRequest<bool>
{
    public Guid SubjectId { get; set; } = subjectId;
    public string ProfessorId { get; set; } = string.Empty;
}