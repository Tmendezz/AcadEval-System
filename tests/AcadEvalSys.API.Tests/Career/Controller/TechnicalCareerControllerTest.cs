using System.Net;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using FluentAssertions;
using Moq;
using System.Text.Json;
using System.Text.Json.Serialization;
using AcadEvalSys.API.Tests;
using AcadEvalSys.Application.Career.Commands.CreateCareer;
using AcadEvalSys.Application.Career.Commands.DeleteCareer;
using AcadEvalSys.Application.Career.Commands.UpdateCareer;
using AcadEvalSys.Application.Career.Dtos;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System.Net.Http;
using System.Text;

namespace AcadEvalSys.API.tests.Career.Controller
{
    [Collection("Integration Tests")]
    public class TechnicalCareerControllerTest : BaseIntegrationTest
    {
        private readonly Mock<ICareerRepository> _careerRepositoryMock = new();

        protected override void ResetSpecificMocks()
        {
            _careerRepositoryMock.Reset();
        }

        protected override WebApplicationFactory<Program> CreateFactory()
        {
            return new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
                {
                    ConfigureTestServices(services);
                    services.Replace(ServiceDescriptor.Scoped(typeof(ICareerRepository),
                        _ => _careerRepositoryMock.Object));
                });
            });
        }
        
        [Fact]
        public async Task GetCareers_ForValidRequest_Returns200Ok()
        {
            // Arrange
            var careers = new List<TechnicalCareer>
            {
                new() { Id = Guid.NewGuid(), Name = "Career 1" },
                new() { Id = Guid.NewGuid(), Name = "Career 2" }
            };
            _careerRepositoryMock.Setup(repo => repo.GetAllCareersAsync())
                .ReturnsAsync(careers);

            // Act
            var result = await Client.GetAsync("/careers");

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task GetCareerById_ForValidId_Returns200Ok()
        {
            // Arrange
            var careerId = Guid.NewGuid();
            var career = new TechnicalCareer { Id = careerId, Name = "Career 1" };
            _careerRepositoryMock.Setup(repo => repo.GetCareerByIdAsync(careerId))
                .ReturnsAsync(career);

            // Act
            var result = await Client.GetAsync($"/careers/{careerId}");

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.OK);
            var content = await result.Content.ReadAsStringAsync();
            var careerDto = JsonSerializer.Deserialize<CareerDto>(content, JsonOptions);
            careerDto.Should().NotBeNull();
            careerDto.Id.Should().Be(careerId);
        }
        
        [Fact]
        public async Task CreateCareer_ForValidRequest_Returns201Created()
        {
            // Arrange
            var newCareer = new CreateCareerCommand { Name = "New Career" };
            var createdId = Guid.NewGuid();
            _careerRepositoryMock.Setup(repo => repo.Create(It.IsAny<TechnicalCareer>()))
                .ReturnsAsync(createdId);

            // Act
            var json = JsonSerializer.Serialize(newCareer, JsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var result = await Client.PostAsync("/careers", content);

            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.Created);
            result.Headers.Location.Should().NotBeNull();
            result.Headers.Location!.AbsolutePath.Should().Be($"/careers/{createdId}");
        }

        [Fact]
        public async Task UpdateCareer_ForValidRequest_Returns204NoContent()
        {
            // Arrange
            var careerId = Guid.NewGuid();
            var existingCareer = new TechnicalCareer { Id = careerId, Name = "Existing Career" };
            var updateCareer = new UpdateCareerCommand
            {
                Id = careerId,
                Name = "Updated Career"
            };
            _careerRepositoryMock.Setup(repo => repo.GetCareerByIdAsync(careerId))
                .ReturnsAsync(existingCareer);
            _careerRepositoryMock.Setup(repo => repo.Update())
                .Returns(Task.CompletedTask);
            
            // Act
            var json = JsonSerializer.Serialize(updateCareer, JsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var result = await Client.PatchAsync($"/careers/{careerId}", content);
            
            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }
        
        [Fact]
        public async Task DeleteCareer_ForValidId_Returns204NoContent()
        {
            // Arrange
            var careerId = Guid.NewGuid();
            var existingCareer = new TechnicalCareer { Id = careerId, Name = "Career to Delete" };
            _careerRepositoryMock.Setup(repo => repo.GetCareerByIdAsync(careerId))
                .ReturnsAsync(existingCareer);
            _careerRepositoryMock.Setup(repo => repo.Delete(existingCareer))
                .Returns(Task.CompletedTask);

            // Act
            var result = await Client.DeleteAsync($"/careers/{careerId}");
            
            // Assert
            result.StatusCode.Should().Be(HttpStatusCode.NoContent);
        }
    }
}
