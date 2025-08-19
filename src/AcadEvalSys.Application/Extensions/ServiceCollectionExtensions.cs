using AcadEvalSys.Application.Users;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;
using AcadEvalSys.Application.Interfaces;
using AcadEvalSys.Application.Services;

namespace AcadEvalSys.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddApplication(this IServiceCollection services)
    {
        var applicationAssembly = typeof(ServiceCollectionExtensions).Assembly;
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(applicationAssembly));
        services.AddAutoMapper(applicationAssembly);
        services.AddValidatorsFromAssembly(applicationAssembly)
            .AddFluentValidationAutoValidation(); //Registra automaticamente los validadores de cada entidad
        services.AddScoped<IUserContext, UserContext>();
        services.AddHttpContextAccessor();

    // Application services
    services.AddScoped<IStudentCsvParser, StudentCsvParser>();
    }
}