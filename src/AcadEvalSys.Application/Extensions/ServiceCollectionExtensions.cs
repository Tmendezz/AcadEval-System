using System.Text;
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
        Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(applicationAssembly));
        services.AddAutoMapper(applicationAssembly);
        services.AddValidatorsFromAssembly(applicationAssembly)
            .AddFluentValidationAutoValidation(); //Registra automaticamente los validadores de cada entidad
        services.AddScoped<IUserContext, UserContext>();
        // Nota: AddHttpContextAccessor se registra en Infrastructure para evitar duplicación

    // Application services
    services.AddScoped<IStudentExcelParser, StudentExcelParser>();
    }
}