using AcadEvalSys.Infrastructure.Services;
using AcadEvalSys.Domain.Interfaces;
using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.Extensions.DependencyInjection;

namespace AcadEvalSys.Infrastructure.Extensions;

public static class HangfireServiceExtensions
{
    public static IServiceCollection AddHangfireServices(this IServiceCollection services, string connectionString)
    {
        // Configurar Hangfire con PostgreSQL usando la nueva API
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
                SchemaName = "hangfire"  // Usar SchemaName para la nueva versión
            }));

        // Agregar el servidor de Hangfire
        services.AddHangfireServer(options =>
        {
            options.WorkerCount = Environment.ProcessorCount;
            options.Queues = new[] { "reports", "default" };
            options.ServerName = Environment.MachineName;
        });

        // Registrar nuestro servicio de background
        services.AddScoped<IReportGenerationBackgroundService, ReportGenerationBackgroundService>();

        return services;
    }
}
