using AcadEvalSys.Application.Extensions;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Infrastructure.Extensions;
using AcadEvalSys.Infrastructure.Seeders;
using AcadEvalSys.WEB.Server.Extensions;
using AcadEvalSys.WEB.Server.Middlewares;
using Hangfire;
using Serilog;

try
{
    var builder = WebApplication.CreateBuilder(args);

    builder.AddPresentation();
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration, builder.Environment);

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowFrontend",
            policy => policy
                .WithOrigins("https://localhost:5173", "https://acaditec-eseke2dheteuewch.brazilsouth-01.azurewebsites.net")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials());
    });

    var app = builder.Build();

    using (var scope = app.Services.CreateScope())
    {
        var seeder = scope.ServiceProvider.GetRequiredService<IDbSeeder>();
        await seeder.Seed();
    }

    app.UseSerilogRequestLogging();
    app.UseMiddleware<ErrorHandlingMiddleware>();

    // Configurar el dashboard de Hangfire (solo en desarrollo)
    if (app.Environment.IsDevelopment())
    {
        //seed

        app.UseSwagger();
        app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AcadEval API v1"));

        // Dashboard de Hangfire para monitorear trabajos
        app.UseHangfireDashboard("/hangfire");
    }

    app.UseHttpsRedirection();
    app.UseDefaultFiles();
    app.UseStaticFiles();

    app.UsePathBase("/api");
    app.UseRouting();

    app.UseCors("AllowFrontend");

    app.UseAuthentication();
    app.UseAuthorization();


    app.MapGroup("identity")
        .MapIdentityApi<User>()
        .WithTags("Identity");

    app.MapControllers();

    app.MapFallbackToFile("/index.html");

    var serverAddress = app.Urls.FirstOrDefault() ?? "https://localhost:7004";
    var machineName = Environment.MachineName;
    var environment = app.Environment.EnvironmentName;
    Log.Information("Server starting... Target URL: {ServerUrl} on machine {MachineName} ({Environment})",
        serverAddress, machineName, environment);

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex.Message, "Error in app startup");
}
finally
{
    Log.CloseAndFlush();
}

public partial class Program { }