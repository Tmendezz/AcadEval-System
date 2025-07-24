using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Subjects.Commands.EnrollStudent;

public class EnrollStudentInSubjectCommandHandler(
    ILogger<EnrollStudentInSubjectCommandHandler> logger,
    ISubjectRepository subjectRepository,
    IStudentRepository studentRepository) : IRequestHandler<EnrollStudentInSubjectCommand, bool>
{
    public async Task<bool> Handle(EnrollStudentInSubjectCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Enrolling student {StudentId} in subject {SubjectId}", request.StudentId, request.SubjectId);

        var subject = await subjectRepository.GetSubjectByIdAsync(request.SubjectId);
        if (subject == null)
            throw new NotFoundException(nameof(Subject), request.SubjectId.ToString());

        var student = await studentRepository.GetByIdAsync(request.StudentId);
        if (student == null)
            throw new NotFoundException(nameof(Student), request.StudentId);

        // Validar que el estudiante pertenece a la carrera de la materia
        if (student.TechnicalCareerId != subject.TechnicalCareerId)
            throw new InvalidOperationException("El estudiante no pertenece a la carrera técnica de la materia.");

        // Prevenir inscripciones duplicadas
        if (await studentRepository.IsEnrolledInSubjectAsync(request.StudentId, request.SubjectId))
            throw new InvalidOperationException("El estudiante ya está inscrito en esta materia.");

        try
        {
            await studentRepository.EnrollInSubjectAsync(request.StudentId, request.SubjectId);
            logger.LogInformation("Student {StudentId} enrolled in subject {SubjectId} successfully", request.StudentId, request.SubjectId);
            return true;
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Error enrolling student {StudentId} in subject {SubjectId}", request.StudentId, request.SubjectId);
            return false;
        }
    }
}