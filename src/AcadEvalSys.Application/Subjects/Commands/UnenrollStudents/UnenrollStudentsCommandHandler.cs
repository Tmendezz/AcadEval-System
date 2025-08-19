using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Subjects.Commands.UnenrollStudents;

public class UnenrollStudentsCommandHandler(
    ILogger<UnenrollStudentsCommandHandler> logger,
    IStudentRepository studentRepository,
    ISubjectRepository subjectRepository,
    IUserContext userContext) : IRequestHandler<UnenrollStudentsCommand, UnenrollStudentsResult>
{
    public async Task<UnenrollStudentsResult> Handle(UnenrollStudentsCommand request, CancellationToken cancellationToken)
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser == null) throw new UnauthorizedAccessException("User must be authenticated.");

        var result = new UnenrollStudentsResult();

        logger.LogInformation("Bulk unenrolling {Count} students from subject {SubjectId}", 
            request.StudentIds.Count, request.SubjectId);

        // Verificar que la asignatura exista
        var subject = await subjectRepository.GetSubjectByIdAsync(request.SubjectId);
        if (subject == null)
        {
            result.Errors.Add($"Asignatura con ID {request.SubjectId} no encontrada.");
            return result;
        }

        foreach (var studentId in request.StudentIds)
        {
            try
            {
                // Verificar que el estudiante esté inscrito
                var isEnrolled = await studentRepository.IsEnrolledInSubjectAsync(studentId, request.SubjectId);
                if (!isEnrolled)
                {
                    result.StudentsNotFound++;
                    result.Errors.Add($"Estudiante {studentId} no está inscrito en la asignatura.");
                    continue;
                }

                // Desenrolar estudiante
                await studentRepository.UnenrollFromSubjectAsync(studentId, request.SubjectId);
                result.StudentsUnenrolled++;

                logger.LogDebug("Successfully unenrolled student {StudentId} from subject {SubjectId}", 
                    studentId, request.SubjectId);
            }
            catch (Exception ex)
            {
                result.Errors.Add($"Error al desenrolar estudiante {studentId}: {ex.Message}");
                logger.LogError(ex, "Error unenrolling student {StudentId} from subject {SubjectId}", 
                    studentId, request.SubjectId);
            }
        }

        logger.LogInformation("Bulk unenroll completed. Unenrolled: {Unenrolled}, NotFound: {NotFound}, Errors: {ErrorCount}", 
            result.StudentsUnenrolled, result.StudentsNotFound, result.Errors.Count);

        return result;
    }
}
