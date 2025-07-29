using AcadEvalSys.Application.Competencies.Commands.CreateCompetency;
using AcadEvalSys.Domain.Enums;
using FluentValidation.TestHelper;
using Xunit;

namespace AcadEvalSys.Application.Tests.Competencies.Commands.CreateCompetency;

public class CreateCompetencyCommandValidatorTests
{
    private readonly CreateCompetencyCommandValidator _validator;

    public CreateCompetencyCommandValidatorTests()
    {
        _validator = new CreateCompetencyCommandValidator();
    }

    [Fact]
    public void Validator_ForValidCommand_ShouldNotHaveValidationErrors()
    {
        // Arrange
        var command = new CreateCompetencyCommand()
        {
            Name = "Test Competency",
            Description = "This is a test competency.",
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
    
    [Fact()]
    public void Validator_ForInvalidName_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CreateCompetencyCommand()
        {
            Name = "",
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
        var command = new CreateCompetencyCommand()
        {
            Name = new string('A', 101), // 101 characters (exceeds max of 100)
            Description = "This is a test competency.",
            Type = CompetencyType.Soft
        };
        
        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }
    
    [Fact]
    public void Validator_ForTooLongDescription_ShouldHaveValidationError()
    {
        // Arrange
        var command = new CreateCompetencyCommand()
        {
            Name = "Valid Competency",
            Description = new string('A', 251), // 251 characters (exceeds max of 250)
            Type = CompetencyType.Soft
        };
        
        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Description);
    }
    
    [Theory]
    [InlineData((CompetencyType)999)] // Invalid enum value
    public void Validator_ForInvalidType_ShouldHaveValidationError(CompetencyType invalidType)
    {
        // Arrange
        var command = new CreateCompetencyCommand()
        {
            Name = "Valid Competency",
            Description = "Valid description",
            Type = invalidType
        };
        
        // Act & Assert
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(x => x.Type);
    }
}