using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Infrastructure.Services;

/// <summary>
/// Servicio para manejar el logout de usuarios de manera robusta
/// </summary>
public interface ILogoutService
{
    /// <summary>
    /// Ejecuta un logout completo limpiando todas las cookies y sesiones
    /// </summary>
    Task ExecuteLogoutAsync();
    
    /// <summary>
    /// Limpia todas las cookies relacionadas con autenticación
    /// </summary>
    void ClearAllAuthCookies();
    
    /// <summary>
    /// Agrega headers para prevenir cache del navegador
    /// </summary>
    void AddNoCacheHeaders();
}

public class LogoutService : ILogoutService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly ILogger<LogoutService> _logger;

    public LogoutService(
        IHttpContextAccessor httpContextAccessor,
        SignInManager<IdentityUser> signInManager,
        ILogger<LogoutService> logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _signInManager = signInManager;
        _logger = logger;
    }

    public async Task ExecuteLogoutAsync()
    {
        try
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null)
            {
                _logger.LogWarning("HttpContext es null durante el logout");
                return;
            }

            // 1. Cerrar sesión de Identity
            await _signInManager.SignOutAsync();
            
            // 2. Limpiar cookies
            ClearAllAuthCookies();
            
            // 3. Agregar headers anti-cache
            AddNoCacheHeaders();
            
            _logger.LogInformation("Logout ejecutado exitosamente para el usuario");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error durante la ejecución del logout");
            throw;
        }
    }

    public void ClearAllAuthCookies()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext?.Response == null) return;

        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = httpContext.Request.IsHttps,
            SameSite = SameSiteMode.Lax,
            Path = "/",
            Expires = DateTime.UtcNow.AddDays(-1) // Expirar ayer
        };

        // Cookies principales de ASP.NET Core Identity
        var identityCookies = new[]
        {
            ".AspNetCore.Identity.Application",
            ".AspNetCore.Identity.External",
            ".AspNetCore.Identity.TwoFactorUserId",
            ".AspNetCore.Identity.TwoFactorRememberMe"
        };

        foreach (var cookieName in identityCookies)
        {
            httpContext.Response.Cookies.Delete(cookieName, cookieOptions);
            _logger.LogDebug("Cookie eliminada: {CookieName}", cookieName);
        }

        // Cookies de sesión comunes
        var sessionCookies = new[]
        {
            "session",
            "auth",
            "user_session",
            "auth_token"
        };

        foreach (var cookieName in sessionCookies)
        {
            httpContext.Response.Cookies.Delete(cookieName, cookieOptions);
            _logger.LogDebug("Cookie de sesión eliminada: {CookieName}", cookieName);
        }

        // Limpiar cookies personalizadas que empiecen con ciertos prefijos
        var allCookies = httpContext.Request.Cookies.Keys;
        foreach (var cookieName in allCookies)
        {
            if (cookieName.StartsWith("auth_") || 
                cookieName.StartsWith("session_") || 
                cookieName.StartsWith("user_") ||
                cookieName.StartsWith("token_"))
            {
                httpContext.Response.Cookies.Delete(cookieName, cookieOptions);
                _logger.LogDebug("Cookie personalizada eliminada: {CookieName}", cookieName);
            }
        }
    }

    public void AddNoCacheHeaders()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        if (httpContext?.Response == null) return;

        // Headers para prevenir cache del navegador
        httpContext.Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
        httpContext.Response.Headers.Append("Pragma", "no-cache");
        httpContext.Response.Headers.Append("Expires", "Thu, 01 Jan 1970 00:00:00 GMT");
        
        // Headers adicionales de seguridad
        httpContext.Response.Headers.Append("X-Content-Type-Options", "nosniff");
        httpContext.Response.Headers.Append("X-Frame-Options", "DENY");
        httpContext.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
        
        _logger.LogDebug("Headers anti-cache agregados exitosamente");
    }
}

