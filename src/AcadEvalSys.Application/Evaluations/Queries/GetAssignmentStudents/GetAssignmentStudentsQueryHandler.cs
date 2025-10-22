using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using MediatR;

namespace AcadEvalSys.Application.Evaluations.Queries.GetAssignmentStudents;

public class GetAssignmentStudentsQueryHandler 
    : IRequestHandler<GetAssignmentStudentsQuery, List<AssignmentStudentDto>>
{
    private readonly IProfessorCompetencyAssignmentRepository _assignmentRepository;

    public GetAssignmentStudentsQueryHandler(
        IProfessorCompetencyAssignmentRepository assignmentRepository)
    {
        _assignmentRepository = assignmentRepository;
    }

    public async Task<List<AssignmentStudentDto>> Handle(
        GetAssignmentStudentsQuery request, 
        CancellationToken cancellationToken)
    {
        // Obtener todos los estudiantes del assignment
        var studentAssessments = await _assignmentRepository.GetAssignmentStudentsAsync(
            request.AssignmentId, 
            cancellationToken);

        if (!studentAssessments.Any())
        {
            // Verificar que el assignment existe si no hay estudiantes
            var assignment = await _assignmentRepository.GetByIdAsync(request.AssignmentId);
            if (assignment == null)
            {
                throw new NotFoundException(nameof(ProfessorCompetencyAssignment), request.AssignmentId.ToString());
            }
        }

        return studentAssessments.Select(sca => new AssignmentStudentDto
        {
            StudentId = sca.StudentId ?? string.Empty,
            StudentName = sca.Student?.User?.Name ?? string.Empty,
            StudentEmail = sca.Student?.User?.Email ?? string.Empty,

            Status = sca.Status == AssessmentStatus.Completed ? "Evaluated" : "Pending",
            EvaluatedAt = sca.CompletedAt,
            CompetencyLevel = sca.CompetencyLevel.ToString()
        }).ToList();
    }
}