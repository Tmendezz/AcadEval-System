
using AcadEvalSys.Application.StudentCompetencyAssessments.Commands.EvaluateStudentCompetency;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Domain.Repositories;
using Moq;

namespace AcadEvalSys.Application.Tests.StudentCompetencyAssessments.Commands
{
    public class EvaluateStudentCompetencyCommandHandlerTests
    {
        private readonly Mock<IStudentCompetencyAssessmentsRepository> _repositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly EvaluateStudentCompetencyCommandHandler _handler;

        public EvaluateStudentCompetencyCommandHandlerTests()
        {
            _repositoryMock = new Mock<IStudentCompetencyAssessmentsRepository>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _handler = new EvaluateStudentCompetencyCommandHandler(_repositoryMock.Object, _unitOfWorkMock.Object);
        }

        [Fact]
        public async Task Handle_Should_CompleteAssessmentAndAssignment_WhenAllAssessmentsAreCompleted()
        {
            // Arrange
            var command = new EvaluateStudentCompetencyCommand
            {
                StudentId = "student1",
                ProfessorCompetencyAssignmentId = Guid.NewGuid(),
                CompetencyLevel = CompetencyLevel.Level3
            };

            var assignment = new ProfessorCompetencyAssignment
            {
                Id = command.ProfessorCompetencyAssignmentId,
                StudentCompetencyAssessments = new List<StudentCompetencyAssessment>
                {
                    new StudentCompetencyAssessment { StudentId = "student1", ProfessorCompetencyAssignmentId = command.ProfessorCompetencyAssignmentId, Status = AssessmentStatus.Pending },
                    new StudentCompetencyAssessment { StudentId = "student2", ProfessorCompetencyAssignmentId = command.ProfessorCompetencyAssignmentId, Status = AssessmentStatus.Completed }
                }
            };

            var assessment = assignment.StudentCompetencyAssessments.First(a => a.StudentId == "student1");
            _repositoryMock.Setup(r => r.GetByStudentAndAssignment(command.StudentId, command.ProfessorCompetencyAssignmentId)).ReturnsAsync(assessment);

            // Act
            await _handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.Equal(AssessmentStatus.Completed, assessment.Status);
            Assert.Equal(CompetencyLevel.Level3, assessment.CompetencyLevel);
            Assert.NotNull(assessment.CompletedAt);
            Assert.Equal(ProfessorAssignmentStatus.Completed, assignment.Status);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(CancellationToken.None), Times.Exactly(2));
        }
    }
}
