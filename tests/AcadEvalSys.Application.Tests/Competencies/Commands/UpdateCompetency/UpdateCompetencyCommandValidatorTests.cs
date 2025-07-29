using AcadEvalSys.Application.Competencies.Commands.UpdateCompetency;
using AcadEvalSys.Domain.Enums;
using FluentValidation.TestHelper;
using Xunit;

namespace AcadEvalSys.Application.Tests.Competencies.Commands.UpdateCompetency;

public class UpdateCompetencyCommandValidatorTests
{
    private readonly UpdateCompetencyCommandValidator _validator;

    public UpdateCompetencyCommandValidatorTests()
    {
        _validator = new UpdateCompetencyCommandValidator();
    }

    [Fact]
    public void Validator_ForValidCommand_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var command = new UpdateCompetencyCommand()
        {
            Id = Guid.NewGuid(),
            Name = "Updated Competency",
            Description = "This is an updated competency.",
            Type = CompetencyType.Soft,
            CompetencyLevelDescriptions =  new Dictionary<CompetencyLevel, string>
            {
                { CompetencyLevel.Inicial, "Beginner" },
                { CompetencyLevel.Intermedio, "Intermediate" },
                { CompetencyLevel.Avanzado, "Advanced" },
                { CompetencyLevel.Excelente, "Expert" }
            }
        };

        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }
    
    [Theory]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("AB")] // Too short (less than 3 characters)
    public void Validator_ForInvalidName_ShouldHaveValidationError(string invalidName)
    {
        // Arrange
        var command = new UpdateCompetencyCommand()
        {
            Id = Guid.NewGuid(),
            Name = invalidName,
            Description = "This is a test competency.",
            Type = CompetencyType.Soft
        };
        
        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }
    
    [Fact]
    public void Validator_ForTooLongName_ShouldHaveValidationError()
    {
        // Arrange
        var command = new UpdateCompetencyCommand()
        {
            Id = Guid.NewGuid(),
            Name = new string('A', 101), // 101 characters (exceeds max of 100)
            Description = "This is a test competency.",
            Type = CompetencyType.Soft
        };
        
        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }
    
    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public void Validator_ForInvalidDescription_ShouldHaveValidationError(string invalidDescription)
    {
        // Arrange
        var command = new UpdateCompetencyCommand()
        {
            Id = Guid.NewGuid(),
            Name = "Valid Competency",
            Description = invalidDescription,
            Type = CompetencyType.Soft
        };
        
        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Description)
              .WithErrorMessage("Competency description is required.");
    }
    
    [Fact]
    public void Validator_ForTooLongDescription_ShouldHaveValidationError()
    {
        // Arrange
        var command = new UpdateCompetencyCommand()
        {
            Id = Guid.NewGuid(),
            Name = "Valid Competency",
            Description = new string('A', 501), // 501 characters (exceeds max of 500)
            Type = CompetencyType.Soft
        };
        
        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Description)
              .WithErrorMessage("Competency description must not exceed 500 characters.");
    }
    
    [Theory]
    [InlineData((CompetencyType)999)] // Invalid enum value
    public void Validator_ForInvalidType_ShouldHaveValidationError(CompetencyType invalidType)
    {
        // Arrange
        var command = new UpdateCompetencyCommand()
        {
            Id = Guid.NewGuid(),
            Name = "Valid Competency",
            Description = "Valid description",
            Type = invalidType
        };
        
        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Type)
              .WithErrorMessage("Invalid competency type.");
    }
}