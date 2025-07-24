using AcadEvalSys.Application.Competencies.Commands.DeleteCompetency;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Repositories;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace AcadEvalSys.Application.Tests.Competencies.Commands.DeleteCompetency;

public class DeleteCompetencyCommandHandlerTests
{
    private readonly Mock<ILogger<DeleteCompetencyCommandHandler>> _loggerMock;
    private readonly Mock<ICompetencyRepository> _competencyRepositoryMock;
    private readonly Mock<IUserContext> _userContextMock;
    private readonly DeleteCompetencyCommandHandler _handler;
    private readonly CurrentUser _currentUser;

    public DeleteCompetencyCommandHandlerTests()
    {
        _loggerMock = new Mock<ILogger<DeleteCompetencyCommandHandler>>();
        _competencyRepositoryMock = new Mock<ICompetencyRepository>();
        _userContextMock = new Mock<IUserContext>();
        
        _currentUser = new CurrentUser(Guid.NewGuid().ToString(), "test@test.com", [UserRoles.Admin]);
        _userContextMock.Setup(uc => uc.GetCurrentUser()).Returns(_currentUser);
        
        _handler = new DeleteCompetencyCommandHandler(
            _loggerMock.Object,
            _competencyRepositoryMock.Object,
            _userContextMock.Object
        );
    }

    [Fact]
    public async Task Handle_ForValidCommand_ShouldDeleteCompetencySuccessfully()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var command = new DeleteCompetencyCommand(competencyId);

        _competencyRepositoryMock.Setup(repo => repo.DeleteAsync(competencyId, _currentUser.Id))
            .Returns(Task.CompletedTask);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        _competencyRepositoryMock.Verify(repo => repo.DeleteAsync(competencyId, _currentUser.Id), Times.Once);
        _userContextMock.Verify(uc => uc.GetCurrentUser(), Times.Once);
    }

    [Fact]
    public async Task Handle_ForNonExistentCompetency_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var command = new DeleteCompetencyCommand(competencyId);

        _competencyRepositoryMock.Setup(repo => repo.DeleteAsync(competencyId, _currentUser.Id))
            .ThrowsAsync(new InvalidOperationException($"Competency with ID {competencyId} was not found."));

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None)
        );

        exception.Message.Should().Be($"Competency with ID {competencyId} was not found.");
    }
}
