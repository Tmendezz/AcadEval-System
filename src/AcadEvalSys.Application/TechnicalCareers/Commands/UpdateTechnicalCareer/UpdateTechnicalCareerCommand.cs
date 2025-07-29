using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.UpdateTechnicalCareer
{
    public class UpdateTechnicalCareerCommand : IRequest
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}