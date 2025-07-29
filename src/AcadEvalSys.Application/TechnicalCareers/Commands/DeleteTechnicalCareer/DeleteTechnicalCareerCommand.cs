using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.DeleteTechnicalCareer
{
    public class DeleteTechnicalCareerCommand(Guid id) : IRequest
    {
        public Guid Id { get; } = id;
    }
}