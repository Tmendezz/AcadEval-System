using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.CreateTechnicalCareer
{
    public class CreateTechnicalCareerCommandHandler(ILogger<CreateTechnicalCareerCommand> logger, IMapper mapper, ITechnicalCareerRepository careerRepository) : IRequestHandler<CreateTechnicalCareerCommand, Guid>
    {
        public async Task<Guid> Handle(CreateTechnicalCareerCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Creating a new technical career {@TechnicalCareer}", request);

            var career = mapper.Map<TechnicalCareer>(request);

            var id = await careerRepository.Create(career);
            return id;
        }
    }

}