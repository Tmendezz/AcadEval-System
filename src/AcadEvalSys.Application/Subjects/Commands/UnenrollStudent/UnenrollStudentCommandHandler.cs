using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Subjects.Commands.UnenrollStudent;

public class UnenrollStudentCommandHandler(
    ILogger<UnenrollStudentCommandHandler> logger,
    IStudentRepository studentRepository,
    ISubjectRepository subjectRepository,
    IUserContext userContext) : IRequestHandler<UnenrollStudentCommand, bool>
{
    public async Task<bool> Handle(UnenrollStudentCommand request, CancellationToken cancellationToken)
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser == null) throw new UnauthorizedAccessException("User must be authenticated.");

        logger.LogInformation("Unenrolling student {StudentId} from subject {SubjectId}", 
            request.StudentId, request.SubjectId);

        // Verificar que la asignatura exista
        var subject = await subjectRepository.GetSubjectByIdAsync(request.SubjectId);
        if (subject == null)
        {
            logger.LogWarning("Subject {SubjectId} not found", request.SubjectId);
            return false;
        }

        // Verificar que el estudiante esté inscrito
        var isEnrolled = await studentRepository.IsEnrolledInSubjectAsync(request.StudentId, request.SubjectId);
        if (!isEnrolled)
        {
            logger.LogWarning("Student {StudentId} is not enrolled in subject {SubjectId}", 
                request.StudentId, request.SubjectId);
            return false;
        }

        // Desenrolar estudiante
        await studentRepository.UnenrollFromSubjectAsync(request.StudentId, request.SubjectId);

        logger.LogInformation("Successfully unenrolled student {StudentId} from subject {SubjectId}", 
            request.StudentId, request.SubjectId);

        return true;
    }
}
