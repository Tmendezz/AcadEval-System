using MediatR;

namespace AcadEvalSys.Application.Evaluations.Queries.GetAssignmentStudents;

public record GetAssignmentStudentsQuery(
    Guid AssignmentId
) : IRequest<List<AssignmentStudentDto>>;