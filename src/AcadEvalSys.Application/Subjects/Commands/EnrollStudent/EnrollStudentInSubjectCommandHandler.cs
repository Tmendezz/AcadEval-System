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
        logger.LogInformation("Enrolling student {StudentId} in subject {SubjectId} of career {CareerId}", request.StudentId, request.SubjectId, request.TechnicalCareerId);

        var subject = await subjectRepository.GetSubjectByIdAsync(request.SubjectId);
        if (subject == null)
            throw new NotFoundException(nameof(Subject), request.SubjectId.ToString());

        // Validar que la materia pertenece a la carrera técnica especificada
        if (subject.TechnicalCareerId != request.TechnicalCareerId)
        {
            logger.LogWarning("Subject with ID: {SubjectId} does not belong to career {CareerId}", request.SubjectId, request.TechnicalCareerId);
            throw new NotFoundException(nameof(Subject), request.SubjectId.ToString());
        }

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
            logger.LogInformation("Student {StudentId} enrolled in subject {SubjectId} of career {CareerId} successfully", request.StudentId, request.SubjectId, request.TechnicalCareerId);
            return true;
        }
        catch (InvalidOperationException ex)
        {
            logger.LogError(ex, "Error enrolling student {StudentId} in subject {SubjectId} of career {CareerId}", request.StudentId, request.SubjectId, request.TechnicalCareerId);
            return false;
        }
    }
}