using AcadEvalSys.Application.Services;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using AcadEvalSys.Infrastructure.Authorization;
using AcadEvalSys.Infrastructure.Configuration;
using AcadEvalSys.Infrastructure.Persistence;
using AcadEvalSys.Infrastructure.Repositories;
using AcadEvalSys.Infrastructure.Seeders;
using AcadEvalSys.Infrastructure.Services;
using AcadEvalSys.Application.Users.Services;
using AcadEvalSys.Domain.Interfaces;
using AcadEvalSys.Infrastructure.Services.ReportGeneration;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Builders;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Factories;
using AcadEvalSys.Infrastructure.Services.ReportGeneration.Styles;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace AcadEvalSys.Infrastructure.Extensions;


public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        var connectionString = configuration.GetConnectionString("AcadEvalDb");
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException("Connection string 'AcadEvalDb' not found.");
            }

            options.UseNpgsql(connectionString);

            if (environment.IsDevelopment())
            {
                options.EnableSensitiveDataLogging();
            }
        });

        // Configurar Storage (Azure Blob por defecto)
        services.Configure<StorageConfiguration>(configuration.GetSection(StorageConfiguration.Section));
        services.Configure<GoogleDriveStorageConfiguration>(configuration.GetSection(GoogleDriveStorageConfiguration.Section));

        var storageProvider = configuration.GetValue<string>("Storage:Provider");
        if (string.Equals(storageProvider, "GoogleDrive", StringComparison.OrdinalIgnoreCase))
        {
            services.AddScoped<IStorageService, GoogleDriveStorageService>();
        }
        else
        {
            services.AddScoped<IStorageService, StorageService>();
        }
        
        // Configurar Reportes
        services.AddScoped<IReportService, PdfReportService>();
        
        // Report Generation Services - Patrón de generación de documentos
        services.AddScoped<IReportStyleService, ReportStyleService>();
        services.AddScoped<ITableBuilder, TableBuilder>();
        services.AddScoped<IHeaderBuilder, HeaderBuilder>();
        services.AddScoped<IContentBuilder, ContentBuilder>();
        services.AddScoped<IDocumentFactory, DocumentFactory>();
        services.AddScoped<IImageService, EmbeddedImageService>();
        
        // Configurar Identity con soporte para cookies
        services.AddIdentityApiEndpoints<User>(options =>
            {
                // Configuraciones de cookies de sesión
                options.SignIn.RequireConfirmedAccount = false;
                options.SignIn.RequireConfirmedEmail = false;
                options.SignIn.RequireConfirmedPhoneNumber = false;

                // Configuraciones de usuario
                options.User.RequireUniqueEmail = true;
            })
            .AddRoles<IdentityRole>()
            .AddClaimsPrincipalFactory<ApplicationUserClaimsPrincipalFactory>()
            .AddEntityFrameworkStores<ApplicationDbContext>();

        // Configurar cookies de autenticación
        services.ConfigureApplicationCookie(options =>
        {
            options.Cookie.HttpOnly = true;
            options.ExpireTimeSpan = TimeSpan.FromDays(120);
            options.SlidingExpiration = true;

            // Configuración más permisiva para desarrollo/Postman
            options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Lax;
            options.Cookie.SecurePolicy = Microsoft.AspNetCore.Http.CookieSecurePolicy.SameAsRequest;

            // Configurar rutas para manejo de autenticación
            options.LoginPath = "/api/identity/login";
            options.LogoutPath = "/api/identity/logout";
            options.AccessDeniedPath = "/api/identity/accessDenied";

            // Configurar para APIs (devolver códigos HTTP en lugar de redirecciones)
            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = 401;
                return Task.CompletedTask;
            };

            options.Events.OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = 403;
                return Task.CompletedTask;
            };
        });

        // Registrar servicios
        services.AddScoped<IDbSeeder, DbSeeder>();
        services.AddScoped<ITechnicalCareerRepository, TechnicalCareerRepository>();
        services.AddScoped<ICompetencyRepository, CompetencyRepository>();
        services.AddScoped<ISubjectRepository, SubjectRepository>();
        services.AddScoped<IProfessorRepository, ProfessorRepository>();
    services.AddScoped<ICoordinatorRepository, CoordinatorRepository>();
        services.AddScoped<IUserProfileService, UserProfileService>();
        services.AddScoped<ISessionService, SessionService>();
        services.AddScoped<ICompetencyEvaluationInstanceRepository, CompetencyEvaluationInstanceRepository>();
        services.AddScoped<IProfessorCompetencyAssignmentRepository, ProfessorCompetencyAssignmentRepository>();
        services.AddScoped<IStudentRepository, StudentRepository>();
        services.AddScoped<IStudentCompetencyAssessmentsRepository, StudentCompetencyAssessmentsRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        // Evaluation Completion
        services.AddScoped<IStudentReportGenerationService, StudentReportGenerationService>();
        
        // Student Reports - NUEVO
        services.AddScoped<IStudentEvaluationReportRepository, StudentEvaluationReportRepository>();
        
        // Enrollment Expiration Service
        services.AddScoped<IEnrollmentExpirationService, EnrollmentExpirationService>();
        
        // Enrollment Expiration Background Service
        services.AddScoped<EnrollmentExpirationBackgroundService>();

        // HttpContextAccessor y LogoutService para manejo de sesión/cookies
        services.AddHttpContextAccessor();
        services.AddScoped<ILogoutService, LogoutService>();
        
        // Configurar Hangfire con PostgreSQL
    services.AddHangfireServices(connectionString!);
        
        return services;
    }
}