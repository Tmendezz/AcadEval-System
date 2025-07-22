using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AcadEvalSys.Application.TechnicalCareers.Dtos;
using MediatR;

namespace AcadEvalSys.Application.TechnicalCareers.Queries.GetTechnicalCareerById
{
    public class GetTechnicalCareerByIdQuery(Guid id) : IRequest<TechnicalCareerDto>
    {
        public Guid Id { get; } = id;
    }
}