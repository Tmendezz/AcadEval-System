
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AcadEvalSys.Application.StudentCompetencyAssessments.Commands.EvaluateStudentCompetency
{
    public class EvaluateStudentCompetencyCommandHandler(
        IStudentCompetencyAssessmentsRepository repository,
        IUnitOfWork unitOfWork)
        : IRequestHandler<EvaluateStudentCompetencyCommand>
    {
        public async Task Handle(EvaluateStudentCompetencyCommand request, CancellationToken cancellationToken)
        {
            var assessment = await repository.GetByStudentAndAssignmentAsync(request.StudentId, request.ProfessorCompetencyAssignmentId);

            if (assessment == null)
            {
                throw new NotFoundException(nameof(StudentCompetencyAssessment), assessment.Id.ToString());
            }

            assessment.CompetencyLevel = request.CompetencyLevel;
            assessment.Status = Domain.Enums.AssessmentStatus.Completed;
            assessment.CompletedAt = DateTime.UtcNow;

            await unitOfWork.SaveChangesAsync(cancellationToken);

            var assignment = assessment.ProfessorCompetencyAssignment;
            if (assignment != null)
            {
                var allAssessmentsCompleted = assignment.StudentCompetencyAssessments.All(a => a.Status == Domain.Enums.AssessmentStatus.Completed);
                if (allAssessmentsCompleted)
                {
                    assignment.Status = Domain.Enums.ProfessorAssignmentStatus.Completed;
                }
            }

            await unitOfWork.SaveChangesAsync(cancellationToken);
        }
    }
}
