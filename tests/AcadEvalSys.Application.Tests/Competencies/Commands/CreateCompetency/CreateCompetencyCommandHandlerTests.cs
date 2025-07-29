using AcadEvalSys.Application.Competencies.Commands.CreateCompetency;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace AcadEvalSys.Application.Tests.Competencies.Commands.CreateCompetency;

public class CreateCompetencyCommandHandlerTests
{
    private readonly Mock<ILogger<CreateCompetencyCommandHandler>> _loggerMock;
    private readonly Mock<ICompetencyRepository> _competencyRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IUserContext> _userContextMock;
    private readonly CreateCompetencyCommandHandler _handler;
    private readonly CurrentUser _currentUser;

    public CreateCompetencyCommandHandlerTests()
    {
        _loggerMock = new Mock<ILogger<CreateCompetencyCommandHandler>>();
        _competencyRepositoryMock = new Mock<ICompetencyRepository>();
        _mapperMock = new Mock<IMapper>();
        _userContextMock = new Mock<IUserContext>();
        
        _currentUser = new CurrentUser(Guid.NewGuid().ToString(), "test@test.com", [UserRoles.Admin]);
        _userContextMock.Setup(uc => uc.GetCurrentUser()).Returns(_currentUser);
        
        _handler = new CreateCompetencyCommandHandler(
            _loggerMock.Object,
            _competencyRepositoryMock.Object,
            _mapperMock.Object,
            _userContextMock.Object
        );
    }
    
    [Fact]
    public async Task Handle_ForValidCommand_ShouldReturnCompetencyId()
    {
        // Arrange
        var command = new CreateCompetencyCommand()
        {
            Name = "Test Competency",
            Description = "This is a test competency.",
            Type = CompetencyType.Soft
        };

        var expectedId = Guid.NewGuid();
        var competency = new Competency
        {
            Id = expectedId,
            Name = "Test Competency",
            Description = "This is a test competency.",
            Type = CompetencyType.Soft
        };
        
        _mapperMock.Setup(m => m.Map<Competency>(command))
            .Returns(competency);
        
        _competencyRepositoryMock.Setup(repo => repo.ExistsByNameAsync(command.Name))
            .ReturnsAsync(false);
        _competencyRepositoryMock.Setup(repo => repo.CreateAsync(competency))
            .ReturnsAsync(expectedId);
        
        // Act
        var result = await _handler.Handle(command, CancellationToken.None);
        
        // Assert
        result.Should().Be(expectedId);
        competency.CreatedByUserId.Should().Be(_currentUser.Id);
    
    }

    [Fact]
    public async Task Handle_ForDuplicateName_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var command = new CreateCompetencyCommand()
        {
            Name = "Duplicate Competency",
            Description = "This competency already exists.",
            Type = CompetencyType.Technical
        };

        _competencyRepositoryMock.Setup(repo => repo.ExistsByNameAsync(command.Name))
            .ReturnsAsync(true); // Competency already exists

        // Act & Assert
        var exception = await Assert.ThrowsAsync<DuplicateResourceException>(
            () => _handler.Handle(command, CancellationToken.None)
        );

        exception.Message.Should().Be($"Competency with name '{command.Name}' already exists");
    }

    [Fact]
    public async Task Handle_WithNullUser_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var command = new CreateCompetencyCommand()
        {
            Name = "Test Competency",
            Description = "This is a test competency.",
            Type = CompetencyType.Soft
        };

        _userContextMock.Setup(uc => uc.GetCurrentUser()).Returns((CurrentUser?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None)
        );

        exception.Message.Should().Be("User context not found");   
    }

}