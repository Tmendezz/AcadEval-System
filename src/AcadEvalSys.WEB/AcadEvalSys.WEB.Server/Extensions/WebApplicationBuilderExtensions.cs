using System.Text.Json.Serialization;
using System.Reflection;
using AcadEvalSys.WEB.Server.Middlewares;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;

namespace AcadEvalSys.WEB.Server.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static void AddPresentation(this WebApplicationBuilder builder)
    {
        // Initialize Serilog bootstrap logger
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Console()
            .CreateBootstrapLogger();

        // Configure Serilog
        builder.Host.UseSerilog((context, services, configuration) => configuration
            .ReadFrom.Configuration(context.Configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext());

        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

        builder.Services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo() { Title = "AcadEval ITEC API", Version = "v1" });
            var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
            var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
            c.IncludeXmlComments(xmlPath);
            c.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme()
            {
                Type = SecuritySchemeType.Http,
                Scheme = "Bearer"
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme()
                    {
                        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "bearerAuth" }
                    },
                    []
                }
            });
            c.UseInlineDefinitionsForEnums();
        });

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddScoped<ErrorHandlingMiddleware>();
    }
}