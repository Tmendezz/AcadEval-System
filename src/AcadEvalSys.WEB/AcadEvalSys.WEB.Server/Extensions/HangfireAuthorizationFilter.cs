using Hangfire.Dashboard;

namespace AcadEvalSys.WEB.Server.Extensions;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        // En desarrollo, permitir acceso sin autenticación
        // En producción, aquí deberías verificar permisos de admin
        return true; // Solo para desarrollo - cambiar en producción
    }
}
