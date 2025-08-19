using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Constants.Constants;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.AddStudentToCareer;

public class AddStudentToCareerCommandHandler(
    ILogger<AddStudentToCareerCommandHandler> logger,
    UserManager<User> userManager,
    IStudentRepository studentRepository,
    ITechnicalCareerRepository technicalCareerRepository,
    IUserContext userContext) : IRequestHandler<AddStudentToCareerCommand, string>
{
    public async Task<string> Handle(AddStudentToCareerCommand request, CancellationToken cancellationToken)
    {
        var currentUser = userContext.GetCurrentUser();
        if (currentUser == null) throw new UnauthorizedAccessException("User must be authenticated.");

        logger.LogInformation("Adding student to career {@Command}", request);

        // Verificar que la carrera técnica exista
        var technicalCareer = await technicalCareerRepository.GetCareerByIdAsync(request.TechnicalCareerId);
        if (technicalCareer == null)
        {
            throw new NotFoundException(nameof(TechnicalCareer), request.TechnicalCareerId.ToString());
        }

        // Verificar que el usuario no exista
        var existingUser = await userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            logger.LogWarning("User with email {Email} already exists", request.Email);
            throw new DuplicateResourceException("Un usuario con este email ya existe", request.Email);
        }

        // Crear usuario
        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            EmailConfirmed = true,
            Name = request.Name
        };

        var userResult = await userManager.CreateAsync(user, request.Password);
        if (!userResult.Succeeded)
        {
            var errors = string.Join(", ", userResult.Errors.Select(e => e.Description));
            logger.LogError("Failed to create user: {Errors}", errors);
            throw new BadRequestException($"Error al crear usuario: {errors}");
        }

        // Asignar rol de estudiante
        var roleResult = await userManager.AddToRoleAsync(user, Domain.Constants.Constants.UserRoles.Student);
        if (!roleResult.Succeeded)
        {
            var errors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
            logger.LogError("Failed to add user to role: {Errors}", errors);
            throw new BadRequestException($"Error al asignar rol: {errors}");
        }

        // Crear entidad Student
        var student = new Student
        {
            UserId = user.Id,
            TechnicalCareerId = request.TechnicalCareerId,
            CurrentYear = request.CurrentYear
        };

        await studentRepository.CreateAsync(student);

        logger.LogInformation("Student created successfully with ID: {StudentId} for career {CareerId}", 
            user.Id, request.TechnicalCareerId);

        return user.Id;
    }
}
