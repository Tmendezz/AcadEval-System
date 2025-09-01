using AcadEvalSys.Domain.Enums;

namespace AcadEvalSys.Application.Extensions;

public static class CareerYearExtensions
{
    /// <summary>
    /// Convierte el enum CareerYear a su valor numérico
    /// </summary>
    /// <param name="careerYear">El año de carrera</param>
    /// <returns>El número del año (1, 2, 3)</returns>
    public static int ToNumber(this CareerYear careerYear)
    {
        return (int)careerYear;
    }

    /// <summary>
    /// Convierte el enum CareerYear a su representación en español
    /// </summary>
    /// <param name="careerYear">El año de carrera</param>
    /// <returns>El año en español (Primero, Segundo, Tercero)</returns>
    public static string ToSpanishString(this CareerYear careerYear)
    {
        return careerYear switch
        {
            CareerYear.First => "Primero",
            CareerYear.Second => "Second",
            CareerYear.Third => "Tercero",
            _ => careerYear.ToString()
        };
    }

    /// <summary>
    /// Convierte el enum CareerYear a su representación con ordinal
    /// </summary>
    /// <param name="careerYear">El año de carrera</param>
    /// <returns>El año con ordinal (1°, 2°, 3°)</returns>
    public static string ToOrdinalString(this CareerYear careerYear)
    {
        return $"{careerYear.ToNumber()}";
    }
}
