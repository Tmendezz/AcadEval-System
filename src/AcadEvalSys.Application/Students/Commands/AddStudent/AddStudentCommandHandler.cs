using System.Security.Principal;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Students.Commands.AddStudent;

public class AddStudentCommandHandler(
    ILogger<AddStudentCommandHandler> logger,
    UserManager<User> userManager,
    IStudentRepository studentRepository,
    IMapper mapper
    ) : IRequestHandler<AddStudentCommand, string>
{
    public async Task<string> Handle(AddStudentCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Adding student {@Student}", request);

        var user = mapper.Map<User>(request);

        var existingUser = await userManager.FindByEmailAsync(request.Email);

        if (existingUser != null)
        {
            logger.LogWarning("User with email {Email} already exists", request.Email);
            throw new DuplicateResourceException(nameof(Student), request.Email);
        }

        var userResult = await userManager.CreateAsync(user, request.Password);
        if (!userResult.Succeeded)
        {
            logger.LogError("Failed to create user: {Errors}", string.Join(", ", userResult.Errors.Select(e => e.Description)));
            throw new UserCreationException($"Failed to create user: {string.Join(", ", userResult.Errors.Select(e => e.Description))}");
        }

        logger.LogInformation("User created successfully with ID: {UserId}", user.Id);

        var roleResult = await userManager.AddToRoleAsync(user, UserRoles.Student);
        if (!roleResult.Succeeded)
        {
            logger.LogError("Failed to add user to role: {Errors}", string.Join(", ", roleResult.Errors.Select(e => e.Description)));
            throw new UserRoleAssignmentException($"Failed to add user to role: {string.Join(", ", roleResult.Errors.Select(e => e.Description))}");
        }

        var student = mapper.Map<Student>(request);
        student.UserId = user.Id;

        await studentRepository.CreateAsync(student);

        logger.LogInformation("Student created successfully with ID: {StudentId}", user.Id);
        return user.Id;
    }
}



