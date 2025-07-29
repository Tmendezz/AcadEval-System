using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Domain.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Commands.CompleteStudentAssessment;

public class CompleteStudentAssessmentCommandHandler(ILogger<CompleteStudentAssessmentCommandHandler> logger,
    IMapper mapper,
    IStudentCompetencyAssessmentsRepository studentCompetencyAssessmentRepository,
    IProfessorCompetencyAssignmentRepository professorCompetencyAssignmentRepository,
    IStudentReportGenerationService evaluationCompletionService
    ) : IRequestHandler<CompleteStudentAssessmentCommand, Guid>
{
    public async Task<Guid> Handle(CompleteStudentAssessmentCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Evaluating student competency for StudentId: {StudentId} and Assignment: {AssignmentId}", 
            request.StudentId, request.ProfessorCompetencyAssignmentId);

        // Buscar directamente el assessment específico 
        var existingAssessment = await studentCompetencyAssessmentRepository
            .GetByStudentAndAssignmentAsync(request.StudentId, request.ProfessorCompetencyAssignmentId);

        if (existingAssessment == null)
        {
            logger.LogError("No existing assessment found for StudentId: {StudentId} and Assignment: {AssignmentId}. " +
                          "This indicates a data consistency issue - assessments should be created automatically when assignments are made.", 
                request.StudentId, request.ProfessorCompetencyAssignmentId);
            
            throw new NotFoundException(nameof(StudentCompetencyAssessment), $"StudentId: {request.StudentId}, AssignmentId: {request.ProfessorCompetencyAssignmentId}");
        }
        
        // Actualizar el assessment existente
        existingAssessment.CompetencyLevel = request.CompetencyLevel ?? throw new ArgumentNullException(nameof(request.CompetencyLevel));
        existingAssessment.Status = AssessmentStatus.Completed;
        existingAssessment.CompletedAt = DateTime.UtcNow;
        existingAssessment.UpdatedAt = DateTime.UtcNow;
        
        await studentCompetencyAssessmentRepository.UpdateAsync(existingAssessment);
        
        // Verificar si el assignment se puede completar
        var allAssessmentsForAssignment = await studentCompetencyAssessmentRepository
            .GetByAssignmentAsync(request.ProfessorCompetencyAssignmentId);
        
        var allCompleted = allAssessmentsForAssignment.All(assessment => assessment.Status == AssessmentStatus.Completed);
        
        if (allCompleted)
        {
            // Obtener y actualizar el professor assignment
            var professorAssignment = await professorCompetencyAssignmentRepository
                .GetByIdAsync(request.ProfessorCompetencyAssignmentId);
            
            if (professorAssignment != null && professorAssignment.Status != ProfessorAssignmentStatus.Completed)
            {
                professorAssignment.Status = ProfessorAssignmentStatus.Completed;
                professorAssignment.UpdatedAt = DateTime.UtcNow;
                
                await professorCompetencyAssignmentRepository.UpdateAsync(professorAssignment);
                
                logger.LogInformation("Professor assignment {AssignmentId} completed automatically", request.ProfessorCompetencyAssignmentId);
            }
        }
        
        logger.LogInformation("Student competency assessment updated with ID: {Id}", existingAssessment.Id);
        return existingAssessment.Id;
    }
}