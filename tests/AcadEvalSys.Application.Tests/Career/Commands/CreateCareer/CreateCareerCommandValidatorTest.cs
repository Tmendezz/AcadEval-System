using AcadEvalSys.Application.TechnicalCareers.Commands.CreateTechnicalCareer;
using FluentValidation.TestHelper;
using Xunit;

namespace AcadEvalSys.Application.Tests.Career.Commands.CreateCareer;

public class CreateTechnicalCareerCommandValidatorTests
{
    private readonly CreateTechnicalCareerCommandValidator _validator;

    public CreateTechnicalCareerCommandValidatorTests()
    {
        _validator = new CreateTechnicalCareerCommandValidator();
    }

    [Fact]
    public void Validator_ForValidCommand_ShouldNotHaveValidationErrors()
    {
        var command = new CreateTechnicalCareerCommand()
        {
            Name = "Test Career"
        };
        
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }
    
    [Fact]
    public void Validator_ForInvalidName_ShouldHaveValidationErrors()
    {
        var command = new CreateTechnicalCareerCommand()
        {
            Name = string.Empty // Invalid name
        };
        
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(c => c.Name);
    }
    [Fact]
    public void Validator_ForTooLongName_ShouldHaveValidationErrors()
    {
        var command = new CreateTechnicalCareerCommand()
        {
            Name = new string('a', 200)
        };
        
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(c => c.Name);
    }
    [Fact]
    public void Validator_ForNullName_ShouldHaveValidationErrors()
    {
        var command = new CreateTechnicalCareerCommand()
        {
            Name = null! // Invalid name
        };
        
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(c => c.Name);
    }
}