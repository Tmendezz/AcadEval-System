using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.CreateTechnicalCareer
{
    public class CreateTechnicalCareerCommandValidator : AbstractValidator<CreateTechnicalCareerCommand>
    {
        public CreateTechnicalCareerCommandValidator()
        {
            RuleFor(dto => dto.Name)
                .Length(3, 100);
            RuleFor(dto => dto.Name)
                .NotEmpty()
                .WithMessage("El nombre es obligatorio.");
        }
    }
}