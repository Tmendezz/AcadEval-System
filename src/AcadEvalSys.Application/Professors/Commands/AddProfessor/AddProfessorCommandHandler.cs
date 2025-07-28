using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Professors.Commands.AddProfessor;

public class AddProfessorCommandHandler(
    ILogger<AddProfessorCommandHandler> logger,
    UserManager<User> userManager,
    IProfessorRepository professorRepository,
    IMapper mapper
    ) : IRequestHandler<AddProfessorCommand, string>
{
    public async Task<string> Handle(AddProfessorCommand request, CancellationToken cancellationToken)
    {
        logger.LogInformation("Adding professor {@Professor}", request);

        var user = mapper.Map<User>(request);

        var existingUser = await userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            logger.LogWarning("User with email {Email} already exists", request.Email);
            throw new DuplicateResourceException(nameof(Professor), request.Email);
        }

        var userResult = await userManager.CreateAsync(user, request.Password);
        if (!userResult.Succeeded)
        {
            logger.LogError("Failed to create user: {Errors}", string.Join(", ", userResult.Errors.Select(e => e.Description)));
            throw new UserCreationException($"Failed to create user: {string.Join(", ", userResult.Errors.Select(e => e.Description))}");
        }

        logger.LogInformation("User created successfully with ID: {UserId}", user.Id);

        var roleResult = await userManager.AddToRoleAsync(user, UserRoles.Professor);
        if (!roleResult.Succeeded)
        {
            logger.LogError("Failed to add user to role: {Errors}", string.Join(", ", roleResult.Errors.Select(e => e.Description)));
            throw new UserRoleAssignmentException($"Failed to add user to role: {string.Join(", ", roleResult.Errors.Select(e => e.Description))}");
        }

        var professor = new Professor
        {
            UserId = user.Id,
            Phone = request.Phone
        };

        await professorRepository.CreateAsync(professor);
        
        logger.LogInformation("Professor created successfully with ID: {UserId}", user.Id);
        return user.Id;
    }
}
