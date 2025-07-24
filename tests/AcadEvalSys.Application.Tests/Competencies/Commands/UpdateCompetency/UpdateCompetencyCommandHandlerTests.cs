using AcadEvalSys.Application.Competencies.Commands.UpdateCompetency;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace AcadEvalSys.Application.Tests.Competencies.Commands.UpdateCompetency;

public class UpdateCompetencyCommandHandlerTests
{
    private readonly Mock<ILogger<UpdateCompetencyCommandHandler>> _loggerMock;
    private readonly Mock<ICompetencyRepository> _competencyRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IUserContext> _userContextMock;
    private readonly UpdateCompetencyCommandHandler _handler;
    private readonly CurrentUser _currentUser;

    public UpdateCompetencyCommandHandlerTests()
    {
        _loggerMock = new Mock<ILogger<UpdateCompetencyCommandHandler>>();
        _competencyRepositoryMock = new Mock<ICompetencyRepository>();
        _mapperMock = new Mock<IMapper>();
        _userContextMock = new Mock<IUserContext>();
        
        _currentUser = new CurrentUser(Guid.NewGuid().ToString(), "test@test.com", [UserRoles.Admin]);
        _userContextMock.Setup(uc => uc.GetCurrentUser()).Returns(_currentUser);
        
        _handler = new UpdateCompetencyCommandHandler(
            _loggerMock.Object,
            _competencyRepositoryMock.Object,
            _mapperMock.Object,
            _userContextMock.Object
        );
    }

    [Fact]
    public async Task Handle_ForValidCommand_ShouldUpdateCompetencySuccessfully()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var command = new UpdateCompetencyCommand
        {
            Id = competencyId,
            Name = "Updated Competency",
            Description = "Updated description",
            Type = CompetencyType.Technical
        };

        var existingCompetency = new Competency
        {
            Id = competencyId,
            Name = "Original Competency",
            Description = "Original description",
            Type = CompetencyType.Soft,
            CreatedAt = DateTime.UtcNow.AddDays(-1),
            CreatedByUserId = "original-user",
            IsActive = true
        };

        _competencyRepositoryMock.Setup(repo => repo.GetByIdAsync(competencyId))
            .ReturnsAsync(existingCompetency);
        
        _competencyRepositoryMock.Setup(repo => repo.ExistsByNameAsync(command.Name))
            .ReturnsAsync(false);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        existingCompetency.UpdatedAt.Should().NotBeNull();
        existingCompetency.UpdatedByUserId.Should().Be(_currentUser.Id);
        
        _mapperMock.Verify(m => m.Map(command, existingCompetency), Times.Once);
        _competencyRepositoryMock.Verify(repo => repo.UpdateAsync(existingCompetency), Times.Once);
    }

    [Fact]
    public async Task Handle_ForNonExistentCompetency_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var command = new UpdateCompetencyCommand
        {
            Id = competencyId,
            Name = "Updated Competency",
            Description = "Updated description",
            Type = CompetencyType.Technical
        };

        _competencyRepositoryMock.Setup(repo => repo.GetByIdAsync(competencyId))
            .ReturnsAsync((Competency?)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None)
        );

        exception.Message.Should().Be($"Competency with ID {competencyId} was not found.");
        
        _competencyRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Competency>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ForDuplicateName_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var command = new UpdateCompetencyCommand
        {
            Id = competencyId,
            Name = "Duplicate Name",
            Description = "Updated description",
            Type = CompetencyType.Technical
        };

        var existingCompetency = new Competency
        {
            Id = competencyId,
            Name = "Original Name", // Different from command name
            Description = "Original description",
            Type = CompetencyType.Soft
        };

        _competencyRepositoryMock.Setup(repo => repo.GetByIdAsync(competencyId))
            .ReturnsAsync(existingCompetency);
        
        _competencyRepositoryMock.Setup(repo => repo.ExistsByNameAsync(command.Name))
            .ReturnsAsync(true); // Name already exists

        // Act & Assert
        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => _handler.Handle(command, CancellationToken.None)
        );

        exception.Message.Should().Be($"A competency with the name '{command.Name}' already exists.");
        
        _competencyRepositoryMock.Verify(repo => repo.UpdateAsync(It.IsAny<Competency>()), Times.Never);
    }

    [Fact]
    public async Task Handle_ForSameName_ShouldNotCheckDuplicates()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var sameName = "Same Competency Name";
        var command = new UpdateCompetencyCommand
        {
            Id = competencyId,
            Name = sameName,
            Description = "Updated description",
            Type = CompetencyType.Technical
        };

        var existingCompetency = new Competency
        {
            Id = competencyId,
            Name = sameName, // Same name as command
            Description = "Original description",
            Type = CompetencyType.Soft
        };

        _competencyRepositoryMock.Setup(repo => repo.GetByIdAsync(competencyId))
            .ReturnsAsync(existingCompetency);

        // Act
        await _handler.Handle(command, CancellationToken.None);

        // Assert
        _competencyRepositoryMock.Verify(repo => repo.ExistsByNameAsync(It.IsAny<string>()), Times.Never);
        _competencyRepositoryMock.Verify(repo => repo.UpdateAsync(existingCompetency), Times.Once);
    }

    [Fact]
    public async Task Handle_ShouldSetCorrectAuditProperties()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var command = new UpdateCompetencyCommand
        {
            Id = competencyId,
            Name = "Updated Competency",
            Description = "Updated description",
            Type = CompetencyType.Technical
        };

        var existingCompetency = new Competency
        {
            Id = competencyId,
            Name = "Original Competency",
            Description = "Original description",
            Type = CompetencyType.Soft,
            CreatedAt = DateTime.UtcNow.AddDays(-1),
            CreatedByUserId = "original-user",
            UpdatedAt = null,
            UpdatedByUserId = null
        };

        _competencyRepositoryMock.Setup(repo => repo.GetByIdAsync(competencyId))
            .ReturnsAsync(existingCompetency);
        
        _competencyRepositoryMock.Setup(repo => repo.ExistsByNameAsync(command.Name))
            .ReturnsAsync(false);

        var beforeUpdate = DateTime.UtcNow;

        // Act
        await _handler.Handle(command, CancellationToken.None);

        var afterUpdate = DateTime.UtcNow;

        // Assert
        existingCompetency.UpdatedAt.Should().NotBeNull();
        existingCompetency.UpdatedAt.Should().BeAfter(beforeUpdate);
        existingCompetency.UpdatedAt.Should().BeBefore(afterUpdate);
        existingCompetency.UpdatedByUserId.Should().Be(_currentUser.Id);
        
        // Original audit properties should remain unchanged
        existingCompetency.CreatedAt.Should().BeBefore(beforeUpdate);
        existingCompetency.CreatedByUserId.Should().Be("original-user");
    }
}
