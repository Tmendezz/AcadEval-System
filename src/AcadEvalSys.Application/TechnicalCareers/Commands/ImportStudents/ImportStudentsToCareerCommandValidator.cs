using FluentValidation;
using Microsoft.AspNetCore.Http;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.ImportStudents;

public class ImportStudentsToCareerCommandValidator : AbstractValidator<ImportStudentsToCareerCommand>
{
    private const int MaxFileSizeMb = 5;
    private static readonly string[] AllowedExtensions = { ".csv", ".xlsx" };

    public ImportStudentsToCareerCommandValidator()
    {
        RuleFor(x => x.TechnicalCareerId)
            .NotEmpty().WithMessage("La carrera técnica es requerida.");

        RuleFor(x => x.File)
            .NotNull().WithMessage("El archivo es requerido.")
            .Must(BeAValidFileSize).WithMessage($"El tamaño del archivo no debe exceder {MaxFileSizeMb} MB.")
            .Must(BeAValidFileType).WithMessage("Solo se permiten archivos CSV o XLSX.");
    }

    private bool BeAValidFileSize(IFormFile file)
    {
        return file != null && file.Length <= MaxFileSizeMb * 1024 * 1024;
    }

    private bool BeAValidFileType(IFormFile file)
    {
        if (file == null) return false;
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        return AllowedExtensions.Contains(extension);
    }
}
