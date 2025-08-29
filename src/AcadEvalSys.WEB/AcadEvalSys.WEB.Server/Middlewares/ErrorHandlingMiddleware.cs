using AcadEvalSys.Domain.Exceptions;

namespace AcadEvalSys.WEB.Server.Middlewares;

public class ErrorHandlingMiddleware(
    ILogger<ErrorHandlingMiddleware> logger,
    IHostEnvironment env
) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // No procesar errores para endpoints de autenticación de Identity
        var path = context.Request.Path.Value?.ToLowerInvariant();
        if (path != null && (path.Contains("/identity/login") || path.Contains("/identity/register")))
        {
            await next(context);
            return;
        }

        try
        {
            await next(context);
        }
        catch (NotFoundException notFound)
        {
            context.Response.StatusCode = 404;
            await context.Response.WriteAsJsonAsync(new { Message = notFound.Message });
            logger.LogWarning(notFound.Message);
        }

        catch (UnauthorizedException unauthorized)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { Message = unauthorized.Message });
            logger.LogWarning(unauthorized.Message);
        }

        catch (ForbidException forbid)
        {
            context.Response.StatusCode = 403;
            await context.Response.WriteAsJsonAsync(new { Message = "Access forbbiden" });
            logger.LogWarning(forbid.Message);
        }
        
        catch (BadRequestException badRequest)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new { Message = badRequest.Message });
            logger.LogWarning(badRequest.Message);
        }

        catch (DuplicateResourceException duplicate)
        {
            context.Response.StatusCode = 409;
            await context.Response.WriteAsJsonAsync(new { Message = duplicate.Message });
            logger.LogWarning(duplicate.Message);
        }
        
        
        catch (Exception ex)
        {
            // En desarrollo
            var baseException = ex.GetBaseException();

            var response = env.IsDevelopment()
                ? new { Message = baseException.Message, StackTrace = baseException.StackTrace }
                : new { Message = "Error interno del servidor. Intente nuevamente más tarde.", StackTrace = (string?)null };

            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(response);
            logger.LogError(ex, ex.Message);
        }
    }
}