using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.UpdateTechnicalCareer
{
    public class UpdateTechnicalCareerCommandValidator : AbstractValidator<UpdateTechnicalCareerCommand>
    {
        public UpdateTechnicalCareerCommandValidator()
        {
            RuleFor(dto => dto.Name)
                .Length(3, 100);
            RuleFor(x => x.Name)
                .NotEmpty()
                .WithMessage("El nombre es obligatorio.");

        }
    }
}