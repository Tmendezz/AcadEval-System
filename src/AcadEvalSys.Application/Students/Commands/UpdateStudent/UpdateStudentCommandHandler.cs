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
        
        logger.LogInformation("Found user to update: ID: {UserId}, Current Email: {CurrentEmail}, Current Name: {CurrentName}", 
            user.Id, user.Email, user.Name);

        var student = await studentRepository.GetByUserIdAsync(request.UserId);
        if (student == null)
        {
            logger.LogWarning("Student with user ID {UserId} not found", request.UserId);
            throw new NotFoundException(nameof(Student), request.UserId);
        }

        // Check if email has changed to avoid duplicate validation on same user
        var emailChanged = !string.Equals(user.Email, request.Email, StringComparison.OrdinalIgnoreCase);
        
        logger.LogInformation("Email change validation: Current email: {CurrentEmail}, New email: {NewEmail}, Email changed: {EmailChanged}", 
            user.Email, request.Email, emailChanged);
        
        if (emailChanged)
        {
            // Check if new email is already taken by another user
            var existingUserWithEmail = await userManager.FindByEmailAsync(request.Email);
            logger.LogInformation("Checking for existing user with email {Email}. Found: {Found}, User ID: {UserId}", 
                request.Email, existingUserWithEmail != null, existingUserWithEmail?.Id);
                
            if (existingUserWithEmail != null && existingUserWithEmail.Id != user.Id)
            {
                logger.LogWarning("Email {Email} is already taken by another user. Current user ID: {CurrentUserId}, Existing user ID: {ExistingUserId}, Existing user name: {ExistingUserName}", 
                    request.Email, user.Id, existingUserWithEmail.Id, existingUserWithEmail.Name);
                throw new InvalidOperationException($"El email '{request.Email}' ya está siendo utilizado por otro usuario");
            }
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
