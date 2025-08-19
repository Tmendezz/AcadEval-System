using AcadEvalSys.Application.Subjects.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using AcadEvalSys.Domain.Enums;
using AcadEvalSys.Application.Users;
using AcadEvalSys.Domain.Exceptions;
using System.Text;
using AcadEvalSys.Application.Students.Importing;
using AcadEvalSys.Application.Interfaces;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.ImportStudents;

public class ImportStudentsToCareerCommandHandler(
    ILogger<ImportStudentsToCareerCommandHandler> logger,
    UserManager<User> userManager,
    IStudentRepository studentRepository,
    ITechnicalCareerRepository technicalCareerRepository,
    IUserContext userContext,
    IStudentCsvParser studentCsvParser) : IRequestHandler<ImportStudentsToCareerCommand, ImportStudentsResultDto>
{
    public async Task<ImportStudentsResultDto> Handle(ImportStudentsToCareerCommand request, CancellationToken cancellationToken)
    {
        var result = new ImportStudentsResultDto();
        var currentUser = userContext.GetCurrentUser();
        if (currentUser == null) throw new UnauthorizedAccessException("User must be authenticated.");

        var technicalCareer = await technicalCareerRepository.GetCareerByIdAsync(request.TechnicalCareerId);
        if (technicalCareer == null)
        {
            result.Errors.Add($"Carrera técnica con ID {request.TechnicalCareerId} no encontrada.");
            return result;
        }

        var records = new List<ImportStudentRecord>();
        try
        {
            records = studentCsvParser.Parse(request.File).ToList();
        }
        catch (Exception ex)
        {
            result.Errors.Add($"Error al leer el archivo CSV: {ex.Message}. Formato esperado: 'Email,Nombre,Año[,Contraseña]'. El campo Año admite 1/2/3 o Primero/Segundo/Tercero (también First/Second/Third).");
            logger.LogError(ex, "Error reading CSV file for student import to career {CareerId}.", request.TechnicalCareerId);
            return result;
        }

        foreach (var record in records)
        {
            if (string.IsNullOrWhiteSpace(record.Email) || string.IsNullOrWhiteSpace(record.Name))
            {
                result.Errors.Add($"Fila inválida: Email y Nombre son requeridos. Fila: {record.Email}, {record.Name}");
                continue;
            }

            // Validar current_year
            if (!Enum.TryParse<CareerYear>(record.CurrentYear, true, out var careerYear))
            {
                result.Errors.Add($"Año inválido '{record.CurrentYear}' para {record.Email}. Use 1/2/3 o Primero/Segundo/Tercero (también First/Second/Third).");
                continue;
            }

            try
            {
                var user = await userManager.FindByEmailAsync(record.Email);
                string studentUserId;

                if (user == null)
                {
                    // Create new user
                    user = new User
                    {
                        UserName = record.Email,
                        Email = record.Email,
                        EmailConfirmed = true,
                        Name = record.Name
                    };

                    var password = string.IsNullOrWhiteSpace(record.Password) ? "Contraseña123_" : record.Password;
                    var createResult = await userManager.CreateAsync(user, password);

                    if (!createResult.Succeeded)
                    {
                        result.Errors.Add($"Error al crear usuario {record.Email}: {string.Join(", ", createResult.Errors.Select(e => e.Description))}");
                        continue;
                    }

                    await userManager.AddToRoleAsync(user, Domain.Constants.Constants.UserRoles.Student);
                    studentUserId = user.Id;
                    result.UsersCreated++;
                    if (string.IsNullOrWhiteSpace(record.Password))
                    {
                        result.GeneratedPasswords.Add(new GeneratedPasswordDto { Email = record.Email, Password = password });
                    }
                }
                else
                {
                    studentUserId = user.Id;
                }

                // Ensure Student entity exists and is linked to the correct career/year
                var student = await studentRepository.GetByUserIdAsync(studentUserId);
                if (student == null)
                {
                    student = new Student
                    {
                        UserId = studentUserId,
                        TechnicalCareerId = request.TechnicalCareerId,
                        CurrentYear = careerYear
                    };
                    await studentRepository.CreateAsync(student);
                    result.StudentsEnrolled++; // En este contexto, "enrolled" significa creado en la carrera
                }
                else
                {
                    // Check if student needs to be updated
                    if (student.TechnicalCareerId != request.TechnicalCareerId || student.CurrentYear != careerYear)
                    {
                        student.TechnicalCareerId = request.TechnicalCareerId;
                        student.CurrentYear = careerYear;
                        await studentRepository.UpdateAsync(student);
                        result.StudentsEnrolled++;
                    }
                    else
                    {
                        result.StudentsAlreadyEnrolled++;
                    }
                }
            }
            catch (Exception ex)
            {
                result.Errors.Add($"Error procesando {record.Email}: {ex.Message}");
                logger.LogError(ex, "Error processing student import record for {Email} in career {CareerId}", record.Email, request.TechnicalCareerId);
            }
        }

        logger.LogInformation("Student import to career {CareerId} completed. UsersCreated: {UsersCreated}, StudentsCreated: {StudentsEnrolled}, StudentsAlreadyInCareer: {StudentsAlreadyEnrolled}, Errors: {ErrorCount}",
            request.TechnicalCareerId, result.UsersCreated, result.StudentsEnrolled, result.StudentsAlreadyEnrolled, result.Errors.Count);

        return result;
    }

}

// CsvHelper ClassMap to support Spanish headers and flexible year parsing
public sealed class ImportStudentRecordMap : ClassMap<ImportStudentRecord>
{
    public ImportStudentRecordMap()
    {
        // Map Email: allow variations
        Map(m => m.Email)
            .Name("Email")
            .Validate(args => !string.IsNullOrWhiteSpace(args.Field));

        // Map Name: allow 'Nombre' or 'Name'
        Map(m => m.Name)
            .Name("Nombre", "Name")
            .Validate(args => !string.IsNullOrWhiteSpace(args.Field));

        // Map Password: optional, support Spanish 'Contraseña' as well
        Map(m => m.Password)
            .Name("Contraseña", "Password")
            .Optional();

        // Map Year: support 'Año', 'Anio', 'Year', 'current_year'
        Map(m => m.CurrentYear)
            .Name("Año", "Anio", "Year", "current_year")
            .Convert(args =>
            {
                string? raw = null;
                if (args.Row.TryGetField<string>("Año", out var a1)) raw = a1;
                else if (args.Row.TryGetField<string>("Anio", out var a2)) raw = a2;
                else if (args.Row.TryGetField<string>("Year", out var a3)) raw = a3;
                else if (args.Row.TryGetField<string>("current_year", out var a4)) raw = a4;
                raw = (raw ?? string.Empty).Trim();

                if (string.IsNullOrWhiteSpace(raw)) return "First"; // default

                // Normalize numeric
                switch (raw)
                {
                    case "1":
                    case "Primero":
                    case "primero":
                    case "First":
                    case "first":
                        return nameof(CareerYear.First);
                    case "2":
                    case "Segundo":
                    case "segundo":
                    case "Second":
                    case "second":
                        return nameof(CareerYear.Second);
                    case "3":
                    case "Tercero":
                    case "tercero":
                    case "Third":
                    case "third":
                        return nameof(CareerYear.Third);
                    default:
                        // Fallback: pass through, Enum.TryParse will handle English names
                        return raw;
                }
            });
    }
}
