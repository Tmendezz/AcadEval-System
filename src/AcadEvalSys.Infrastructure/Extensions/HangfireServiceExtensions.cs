// csharp
using AcadEvalSys.Application.Services;
using AcadEvalSys.Infrastructure.Services;
using AcadEvalSys.Domain.Interfaces;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace AcadEvalSys.Infrastructure.Extensions;

public static class HangfireServiceExtensions
{
    public static IServiceCollection AddHangfireServices(this IServiceCollection services, string connectionString)
    {
        services.AddHangfire(configuration => configuration
            .SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
            .UseSimpleAssemblyNameTypeSerializer()
            .UseRecommendedSerializerSettings()
            .UsePostgreSqlStorage(options =>
            {
                options.UseNpgsqlConnection(connectionString);
            }, new PostgreSqlStorageOptions
            {
                QueuePollInterval = TimeSpan.FromSeconds(1),
                JobExpirationCheckInterval = TimeSpan.FromHours(1),
                CountersAggregateInterval = TimeSpan.FromMinutes(5),
                PrepareSchemaIfNecessary = true,
                TransactionSynchronisationTimeout = TimeSpan.FromMinutes(5),
                SchemaName = "hangfire"
            }));

        services.AddHangfireServer(options =>
        {
            options.WorkerCount = Environment.ProcessorCount;
            options.Queues = new[] { "reports", "default" };
            options.ServerName = Environment.MachineName;
        });

        // Servicios propios
        services.AddScoped<IReportGenerationBackgroundService, ReportGenerationBackgroundService>();
        // Nota: IEnrollmentExpirationService se registra en ServiceCollectionExtensions.AddInfrastructure
        // para evitar duplicación

        return services;
    }

    // Programa los jobs recurrentes al iniciar la app
    public static IApplicationBuilder UseEnrollmentExpirationJobs(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var recurring = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

        // Ejecuta diariamente (ajusta el CRON a tu necesidad)
        recurring.AddOrUpdate<IEnrollmentExpirationService>(
            "enrollments:automatic-revocation",
            s => s.RevokeExpiredEnrollmentsAsync(),
            Cron.Daily);

        return app;
    }
}