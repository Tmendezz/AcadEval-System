using AcadEvalSys.Application.TechnicalCareers.Commands.UpdateTechnicalCareer;
using FluentValidation.TestHelper;
using Xunit;

namespace AcadEvalSys.Application.Tests.Career.Commands.UpdateCareer;

public class UpdateTechnicalCareerCommandValidatorTest
{
    private readonly UpdateTechnicalCareerCommandValidator _validator;

    public UpdateTechnicalCareerCommandValidatorTest()
    {
        _validator = new UpdateTechnicalCareerCommandValidator();
    }
    
    [Fact]
    public void Validator_ForValidCommand_ShouldNotHaveValidationErrors()
    {
        var command = new UpdateTechnicalCareerCommand
        {
            Id = Guid.NewGuid(),
            Name = "Updated Career"
        };
        
        var result = _validator.TestValidate(command);
        result.ShouldNotHaveAnyValidationErrors();
    }
    
    [Fact]
    public void Validator_ForInvalidName_ShouldHaveValidationErrors()
    {
        var command = new UpdateTechnicalCareerCommand
        {
            Id = Guid.NewGuid(),
            Name = string.Empty // Invalid name
        };
        
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(c => c.Name);
    }
    
    [Fact]
    public void Validator_ForTooLongName_ShouldHaveValidationErrors()
    {
        var command = new UpdateTechnicalCareerCommand
        {
            Id = Guid.NewGuid(),
            Name = new string('a', 200) // Too long name
        };
        
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(c => c.Name);
    }
    
    [Fact]
    public void Validator_ForNullName_ShouldHaveValidationErrors()
    {
        var command = new UpdateTechnicalCareerCommand
        {
            Id = Guid.NewGuid(),
            Name = null! // Invalid name
        };
        
        var result = _validator.TestValidate(command);
        result.ShouldHaveValidationErrorFor(c => c.Name);
    }
}