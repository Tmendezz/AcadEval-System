using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Students.Commands.UpdateStudent;

public class UpdateStudentCommandHandler(
    ILogger<UpdateStudentCommandHandler> logger,
    UserManager<User> userManager,
    IStudentRepository studentRepository
    ) : IRequestHandler<UpdateStudentCommand, bool>
{
    public async Task<bool> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Updating student with ID: {UserId}", request.UserId);

        var user = await userManager.FindByIdAsync(request.UserId);
        if (user == null)
        {
            logger.LogWarning("User with ID {UserId} not found", request.UserId);
            throw new NotFoundException(nameof(User), request.UserId);
        }

        var student = await studentRepository.GetByUserIdAsync(request.UserId);
        if (student == null)
        {
            logger.LogWarning("Student with user ID {UserId} not found", request.UserId);
            throw new NotFoundException(nameof(Student), request.UserId);
        }

        // Update user information
        user.UserName = request.Email;
        user.Email = request.Email;
        user.Name = request.Name;

        var userResult = await userManager.UpdateAsync(user);
        if (!userResult.Succeeded)
        {
            logger.LogError("Failed to update user: {Errors}", string.Join(", ", userResult.Errors.Select(e => e.Description)));
            throw new InvalidOperationException($"Failed to update user: {string.Join(", ", userResult.Errors.Select(e => e.Description))}");
        }

        // Update student information
        student.TechnicalCareerId = request.TechnicalCareerId;
        student.CurrentYear = request.CurrentYear;

        await studentRepository.UpdateAsync(student);
        
        logger.LogInformation("Student with ID: {UserId} updated successfully", request.UserId);
        return true;
    }
}
