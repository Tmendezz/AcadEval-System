using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using FluentAssertions;
using Moq;
using System.Text.Json;
using AcadEvalSys.API.Tests;
using AcadEvalSys.Application.TechnicalCareers.Commands.CreateTechnicalCareer;
using AcadEvalSys.Application.TechnicalCareers.Commands.UpdateTechnicalCareer;
using AcadEvalSys.Application.TechnicalCareers.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Net.Http.Json;
using System.Text;

namespace AcadEvalSys.API.Tests.Controllers
{
    [Collection("Integration Tests")]
    public class TechnicalCareerControllerTest : BaseIntegrationTest
    {
        private readonly Mock<ITechnicalCareerRepository> _technicalCareerRepositoryMock = new();

        protected override void ResetSpecificMocks()
        {
            _technicalCareerRepositoryMock.Reset();
        }

        protected override WebApplicationFactory<Program> CreateFactory()
        {
            return new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    ConfigureTestServices(services);
                    services.Replace(ServiceDescriptor.Scoped(typeof(ITechnicalCareerRepository),
                        _ => _technicalCareerRepositoryMock.Object));
                });
            });
        }
        
        [Fact]
        public async Task GetTechnicalCareers_ForValidRequest_Returns200Ok()
        {
            // Arrange
            var careers = new List<TechnicalCareer>
            {
                new() { Id = Guid.NewGuid(), Name = "Software Engineering" },
                new() { Id = Guid.NewGuid(), Name = "Data Science" }
            };
            _technicalCareerRepositoryMock.Setup(repo => repo.GetAllCareersAsync())
                .ReturnsAsync(careers);

            // Act
            var result = await Client.GetAsync("/technical-careers");

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task GetTechnicalCareerById_ForValidId_Returns200Ok()
        {
            // Arrange
            var careerId = Guid.NewGuid();
            var career = new TechnicalCareer { Id = careerId, Name = "Software Engineering" };
            _technicalCareerRepositoryMock.Setup(repo => repo.GetCareerByIdAsync(careerId))
                .ReturnsAsync(career);

            // Act
            var result = await Client.GetAsync($"/technical-careers/{careerId}");
            var careerDto = await result.Content.ReadFromJsonAsync<TechnicalCareerDto>(JsonOptions);

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            careerDto.Should().NotBeNull();
            careerDto.Id.Should().Be(careerId);
            careerDto.Name.Should().Be("Software Engineering");
        }

        [Fact]
        public async Task GetTechnicalCareerById_ForNonExistentId_Returns404NotFound()
        {
            // Arrange
            var careerId = Guid.NewGuid();
            _technicalCareerRepositoryMock.Setup(repo => repo.GetCareerByIdAsync(careerId))
                .ReturnsAsync((TechnicalCareer?)null);

            // Act
            var result = await Client.GetAsync($"/technical-careers/{careerId}");

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
        
        [Fact]
        public async Task CreateTechnicalCareer_ForValidRequest_Returns201Created()
        {
            // Arrange
            var newCareer = new CreateTechnicalCareerCommand { Name = "Cybersecurity" };
            var createdId = Guid.NewGuid();
            
            _technicalCareerRepositoryMock.Setup(repo => repo.Create(It.IsAny<TechnicalCareer>()))
                .ReturnsAsync(createdId);

            // Act
            var json = JsonSerializer.Serialize(newCareer, JsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var result = await Client.PostAsync("/technical-careers", content);

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.Created);
            result.Headers.Location.Should().NotBeNull();
            result.Headers.Location!.AbsolutePath.Should().Be($"/technical-careers/{createdId}");
        }

        [Fact]
        public async Task CreateTechnicalCareer_WithInvalidData_ShouldReturn400BadRequest()
        {
            // Arrange
            var invalidCareer = new
            {
                Name = "" // Invalid: empty name
            };

            var json = JsonSerializer.Serialize(invalidCareer, JsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var result = await Client.PostAsync("/technical-careers", content);

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task CreateTechnicalCareer_WithTooLongName_ShouldReturn400BadRequest()
        {
            // Arrange
            var invalidCareer = new
            {
                Name = new string('a', 200) // Too long name
            };

            var json = JsonSerializer.Serialize(invalidCareer, JsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var result = await Client.PostAsync("/technical-careers", content);

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task UpdateTechnicalCareer_ForValidRequest_Returns204NoContent()
        {
            // Arrange
            var careerId = Guid.NewGuid();
            var originalCareer = new TechnicalCareer { Id = careerId, Name = "Original Career" };
            var updatedCareer = new TechnicalCareer { Id = careerId, Name = "Updated Career" };
            
            // Setup mocks for create operation
            _technicalCareerRepositoryMock.Setup(repo => repo.Create(It.IsAny<TechnicalCareer>()))
                .ReturnsAsync(careerId);
                
            // Setup mocks for update and verification operations (in sequence)
            _technicalCareerRepositoryMock.SetupSequence(repo => repo.GetCareerByIdAsync(careerId))
                .ReturnsAsync(originalCareer)  // First call during update
                .ReturnsAsync(updatedCareer);  // Second call during verification
                
            _technicalCareerRepositoryMock.Setup(repo => repo.Update())
                .Returns(Task.CompletedTask);

            // First create a career
            var createCareer = new CreateTechnicalCareerCommand { Name = "Original Career" };
            var createJson = JsonSerializer.Serialize(createCareer, JsonOptions);
            var createContent = new StringContent(createJson, Encoding.UTF8, "application/json");
            var createResult = await Client.PostAsync("/technical-careers", createContent);
            
            var updateCareer = new UpdateTechnicalCareerCommand
            {
                Id = careerId,
                Name = "Updated Career"
            };
            
            // Act
            var json = JsonSerializer.Serialize(updateCareer, JsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var result = await Client.PutAsync($"/technical-careers/{careerId}", content);
            
            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.NoContent);
            
            // Verify the career was actually updated
            var getResult = await Client.GetAsync($"/technical-careers/{careerId}");
            var updatedCareerDto = await getResult.Content.ReadFromJsonAsync<TechnicalCareerDto>(JsonOptions);
            updatedCareerDto!.Name.Should().Be("Updated Career");
        }

        [Fact]
        public async Task UpdateTechnicalCareer_ForNonExistentId_ShouldReturn404NotFound()
        {
            // Arrange
            var careerId = Guid.NewGuid();
            var updateCareer = new UpdateTechnicalCareerCommand
            {
                Id = careerId,
                Name = "Updated Career"
            };

            var json = JsonSerializer.Serialize(updateCareer, JsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var result = await Client.PutAsync($"/technical-careers/{careerId}", content);

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }

        [Fact]
        public async Task UpdateTechnicalCareer_WithInvalidData_ShouldReturn400BadRequest()
        {
            // Arrange
            var careerId = Guid.NewGuid();
            var invalidCareer = new UpdateTechnicalCareerCommand
            {
                Id = careerId,
                Name = "AB" // Too short name (less than 3 characters)
            };

            var json = JsonSerializer.Serialize(invalidCareer, JsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var result = await Client.PutAsync($"/technical-careers/{careerId}", content);

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
        
        [Fact]
        public async Task DeleteTechnicalCareer_ForValidId_Returns204NoContent()
        {
            // Arrange
            var careerId = Guid.NewGuid();
            var existingCareer = new TechnicalCareer { Id = careerId, Name = "Career to Delete" };
            
            _technicalCareerRepositoryMock.Setup(repo => repo.GetCareerByIdAsync(careerId))
                .ReturnsAsync(existingCareer);
            _technicalCareerRepositoryMock.Setup(repo => repo.Delete(existingCareer))
                .Returns(Task.CompletedTask);

            // Act
            var result = await Client.DeleteAsync($"/technical-careers/{careerId}");
            
            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }

        [Fact]
        public async Task DeleteTechnicalCareer_ForNonExistentId_ShouldReturn500InternalServerError()
        {
            // Arrange
            var careerId = Guid.NewGuid();
            
            _technicalCareerRepositoryMock.Setup(repo => repo.GetCareerByIdAsync(careerId))
                .ThrowsAsync(new InvalidOperationException($"Technical Career with ID {careerId} was not found."));

            // Act
            var result = await Client.DeleteAsync($"/technical-careers/{careerId}");

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.InternalServerError);
        }
    }
}
