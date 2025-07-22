using AcadEvalSys.Application.ProfessorCompetencyAssignments.Queries.GetProfessorAssignments;
using AcadEvalSys.Application.StudentCompetencyAssessments.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Moq;

namespace AcadEvalSys.Application.Tests.ProfessorCompetencyAssignments.Queries;

public class GetProfessorAssignmentsQueryHandlerTests
{
    private readonly Mock<IProfessorCompetencyAssignmentRepository> _repositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<ILogger<GetProfessorAssignmentsQueryHandler>> _loggerMock;
    private readonly GetProfessorAssignmentsQueryHandler _handler;

    public GetProfessorAssignmentsQueryHandlerTests()
    {
        _repositoryMock = new Mock<IProfessorCompetencyAssignmentRepository>();
        _mapperMock = new Mock<IMapper>();
        _loggerMock = new Mock<ILogger<GetProfessorAssignmentsQueryHandler>>();
        _handler = new GetProfessorAssignmentsQueryHandler(_repositoryMock.Object, _mapperMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Handle_Should_ReturnProfessorAssignments_WhenAssignmentsExist()
    {
        // Arrange
        var professorId = "prof123";
        var query = new GetProfessorAssignmentsQuery(professorId);

        var competency = new Competency 
        { 
            Id = Guid.NewGuid(), 
            Name = "Test Competency", 
            Description = "Test Description" 
        };

        var subject = new Subject 
        { 
            Id = Guid.NewGuid(), 
            Name = "Test Subject" 
        };

        var assignments = new List<ProfessorCompetencyAssignment>
        {
            new ProfessorCompetencyAssignment
            {
                Id = Guid.NewGuid(),
                CompetencyId = competency.Id,
                SubjectId = subject.Id,
                Status = ProfessorAssignmentStatus.Pending,
                Competency = competency,
                Subject = subject,
                StudentCompetencyAssessments = new List<StudentCompetencyAssessment>
                {
                    new StudentCompetencyAssessment 
                    { 
                        StudentId = "student1", 
                        Status = AssessmentStatus.Pending 
                    },
                    new StudentCompetencyAssessment 
                    { 
                        StudentId = "student2", 
                        Status = AssessmentStatus.Completed 
                    }
                }
            }
        };

        _repositoryMock.Setup(r => r.GetProfessorAssignmentsAsync(professorId, null))
            .ReturnsAsync(assignments);

        _mapperMock.Setup(m => m.Map<IEnumerable<StudentCompetencyEvaluationDto>>(It.IsAny<IEnumerable<StudentCompetencyAssessment>>()))
            .Returns(new List<StudentCompetencyEvaluationDto>());

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        var resultList = result.ToList();
        Assert.Single(resultList);
        
        var assignment = resultList.First();
        Assert.Equal("Test Competency", assignment.CompetencyName);
        Assert.Equal("Test Description", assignment.CompetencyDescription);
        Assert.Equal("Test Subject", assignment.SubjectName);
        Assert.Equal(ProfessorAssignmentStatus.Pending, assignment.Status);
        Assert.Equal(2, assignment.TotalStudentsCount);
        Assert.Equal(1, assignment.EvaluatedStudentsCount);
        Assert.Equal(50m, assignment.ProgressPercentage);

        _repositoryMock.Verify(r => r.GetProfessorAssignmentsAsync(professorId, null), Times.Once);
    }

    [Fact]
    public async Task Handle_Should_FilterByEvaluationInstance_WhenProvided()
    {
        // Arrange
        var professorId = "prof123";
        var evaluationInstanceId = Guid.NewGuid();
        var query = new GetProfessorAssignmentsQuery(professorId, evaluationInstanceId);

        _repositoryMock.Setup(r => r.GetProfessorAssignmentsAsync(professorId, evaluationInstanceId))
            .ReturnsAsync(new List<ProfessorCompetencyAssignment>());

        // Act
        await _handler.Handle(query, CancellationToken.None);

        // Assert
        _repositoryMock.Verify(r => r.GetProfessorAssignmentsAsync(professorId, evaluationInstanceId), Times.Once);
    }
}
