using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;
using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Xunit;
using AcadEvalSys.Application.Competencies.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Repositories;

namespace AcadEvalSys.API.Tests.Controllers;

[Collection("Integration Tests")]
public class CompetencyControllerTests : BaseIntegrationTest
{
    private readonly Mock<ICompetencyRepository> _competencyRepositoryMock = new();

    protected override void ResetSpecificMocks()
    {
        _competencyRepositoryMock.Reset();
    }

    protected override WebApplicationFactory<Program> CreateFactory()
    {
        return new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureTestServices(services =>
            {
                ConfigureTestServices(services);
                services.Replace(ServiceDescriptor.Scoped(typeof(ICompetencyRepository),
                                    _ => _competencyRepositoryMock.Object));
            });
        });
    }

    [Fact]
    public async Task GetCompetencies_ForValidRequest_ShouldReturn200Ok()
    {
        // Arrange
        var competencies = new List<Competency>
        {
            new() { Id = Guid.NewGuid(), Name = "Test Competency 1", Description = "Description 1", Type = CompetencyType.Technical },
            new() { Id = Guid.NewGuid(), Name = "Test Competency 2", Description = "Description 2", Type = CompetencyType.Soft }
        };

        _competencyRepositoryMock.Setup(m => m.GetAllAsync()).ReturnsAsync(competencies);

        // Act
        var response = await Client.GetAsync("/competencies");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetCompetency_ForExistingId_ShouldReturn200Ok()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var competency = new Competency
        {
            Id = competencyId,
            Name = "Test Competency",
            Description = "Test description",
            Type = CompetencyType.Technical
        };

        _competencyRepositoryMock.Setup(m => m.GetByIdAsync(competencyId)).ReturnsAsync(competency);

        // Act
        var response = await Client.GetAsync($"/competencies/{competencyId}");
        var competencyDto = await response.Content.ReadFromJsonAsync<CompetencyDto>(JsonOptions);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        competencyDto.Should().NotBeNull();
        competencyDto.Name.Should().Be("Test Competency");
        competencyDto.Description.Should().Be("Test description");
        competencyDto.Type.Should().Be(CompetencyType.Technical);
    }

    [Fact]
    public async Task GetCompetency_ForNonExistingId_ShouldReturn404NotFound()
    {
        // Arrange
        var competencyId = Guid.NewGuid();

        _competencyRepositoryMock.Setup(m => m.GetByIdAsync(competencyId)).ReturnsAsync((Competency?)null);

        // Act
        var response = await Client.GetAsync($"/competencies/{competencyId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task CreateCompetency_WithValidData_ShouldReturn201Created()
    {
        // Arrange
        var competency = new
        {
            Name = "New Competency",
            Description = "New competency description",
            Type = CompetencyType.Technical
        };

        var expectedId = Guid.NewGuid();

        _competencyRepositoryMock.Setup(m => m.ExistsByNameAsync(competency.Name)).ReturnsAsync(false);
        _competencyRepositoryMock.Setup(m => m.CreateAsync(It.IsAny<Competency>())).ReturnsAsync(expectedId);

        var json = JsonSerializer.Serialize(competency, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PostAsync("/competencies", content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();
    }

    [Fact]
    public async Task CreateCompetency_WithInvalidData_ShouldReturn400BadRequest()
    {
        // Arrange
        var invalidCompetency = new
        {
            Name = "", // Invalid: empty name
            Description = "Valid description",
            Type = CompetencyType.Technical
        };

        var json = JsonSerializer.Serialize(invalidCompetency, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PostAsync("/competencies", content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateCompetency_WithDuplicateName_ShouldReturn409DuplicateResourceError()
    {
        // Arrange
        var duplicateCompetency = new
        {
            Name = "Existing Competency",
            Description = "Description",
            Type = CompetencyType.Soft
        };

        _competencyRepositoryMock.Setup(m => m.ExistsByNameAsync(duplicateCompetency.Name)).ReturnsAsync(true);

        var json = JsonSerializer.Serialize(duplicateCompetency, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PostAsync("/competencies", content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Conflict);
    }

    [Fact]
    public async Task CreateCompetency_WithTooLongName_ShouldReturn400BadRequest()
    {
        // Arrange
        var invalidCompetency = new
        {
            Name = new string('a', 200), // Too long name
            Description = "Valid description",
            Type = CompetencyType.Technical
        };

        var json = JsonSerializer.Serialize(invalidCompetency, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PostAsync("/competencies", content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateCompetency_WithValidData_ShouldReturn204NoContent()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var existingCompetency = new Competency
        {
            Id = competencyId,
            Name = "Original Name",
            Description = "Original description",
            Type = CompetencyType.Technical
        };

        var updatedCompetency = new
        {
            Name = "Updated Name",
            Description = "Updated description",
            Type = CompetencyType.Soft
        };

        _competencyRepositoryMock.Setup(m => m.GetByIdAsync(competencyId)).ReturnsAsync(existingCompetency);
        _competencyRepositoryMock.Setup(m => m.ExistsByNameAsync(updatedCompetency.Name)).ReturnsAsync(false);
        _competencyRepositoryMock.Setup(m => m.UpdateAsync(It.IsAny<Competency>())).Returns(Task.CompletedTask);

        var json = JsonSerializer.Serialize(updatedCompetency, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PutAsync($"/competencies/{competencyId}", content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task UpdateCompetency_ForNonExistingId_ShouldReturn500InternalServerError()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var updatedCompetency = new
        {
            Name = "Updated Name",
            Description = "Updated description",
            Type = CompetencyType.Technical
        };

        _competencyRepositoryMock.Setup(m => m.GetByIdAsync(competencyId)).ReturnsAsync((Competency?)null);

        var json = JsonSerializer.Serialize(updatedCompetency, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PutAsync($"/competencies/{competencyId}", content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task UpdateCompetency_WithInvalidData_ShouldReturn400BadRequest()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var invalidCompetency = new
        {
            Name = "AB", // Too short name
            Description = "Valid description",
            Type = CompetencyType.Technical
        };

        var json = JsonSerializer.Serialize(invalidCompetency, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PutAsync($"/competencies/{competencyId}", content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UpdateCompetency_WithDuplicateName_ShouldReturn500InternalServerError()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var existingCompetency = new Competency
        {
            Id = competencyId,
            Name = "Original Name",
            Description = "Original description",
            Type = CompetencyType.Technical
        };

        var updatedCompetency = new
        {
            Name = "Duplicate Name",
            Description = "Updated description",
            Type = CompetencyType.Soft
        };

        _competencyRepositoryMock.Setup(m => m.GetByIdAsync(competencyId)).ReturnsAsync(existingCompetency);
        _competencyRepositoryMock.Setup(m => m.ExistsByNameAsync(updatedCompetency.Name)).ReturnsAsync(true);

        var json = JsonSerializer.Serialize(updatedCompetency, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PutAsync($"/competencies/{competencyId}", content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task UpdateCompetency_WithSameName_ShouldNotCheckDuplicates()
    {
        // Arrange
        var competencyId = Guid.NewGuid();
        var sameName = "Same Competency Name";
        var existingCompetency = new Competency
        {
            Id = competencyId,
            Name = sameName,
            Description = "Original description",
            Type = CompetencyType.Technical
        };

        var updatedCompetency = new
        {
            Name = sameName, // Same name as existing
            Description = "Updated description",
            Type = CompetencyType.Soft
        };

        _competencyRepositoryMock.Setup(m => m.GetByIdAsync(competencyId)).ReturnsAsync(existingCompetency);
        _competencyRepositoryMock.Setup(m => m.UpdateAsync(It.IsAny<Competency>())).Returns(Task.CompletedTask);

        var json = JsonSerializer.Serialize(updatedCompetency, JsonOptions);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await Client.PutAsync($"/competencies/{competencyId}", content);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
        _competencyRepositoryMock.Verify(m => m.ExistsByNameAsync(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task DeleteCompetency_ForExistingId_ShouldReturn204NoContent()
    {
        // Arrange
        var competencyId = Guid.NewGuid();

        _competencyRepositoryMock.Setup(m => m.DeleteAsync(competencyId, It.IsAny<string>()))
            .Returns(Task.CompletedTask);

        // Act
        var response = await Client.DeleteAsync($"/competencies/{competencyId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task DeleteCompetency_ForNonExistingId_ShouldReturn500InternalServerError()
    {
        // Arrange
        var competencyId = Guid.NewGuid();

        _competencyRepositoryMock.Setup(m => m.DeleteAsync(competencyId, It.IsAny<string>()))
            .ThrowsAsync(new InvalidOperationException($"Competency with ID {competencyId} was not found."));

        // Act
        var response = await Client.DeleteAsync($"/competencies/{competencyId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
    }
}