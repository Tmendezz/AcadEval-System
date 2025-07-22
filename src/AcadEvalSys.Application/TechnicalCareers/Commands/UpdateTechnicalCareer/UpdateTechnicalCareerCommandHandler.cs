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
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.UpdateTechnicalCareer
{
    public class UpdateTechnicalCareerCommandHandler(ILogger<UpdateTechnicalCareerCommandHandler> logger, IMapper mapper, ITechnicalCareerRepository careerRepository) : IRequestHandler<UpdateTechnicalCareerCommand>
    {
        public async Task Handle(UpdateTechnicalCareerCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Updating technical career with id: {TechnicalCareerId} with {@UpdatedTechnicalCareer}", request.Id, request);

            var technicalCareer = await careerRepository.GetCareerByIdAsync(request.Id);

            if (technicalCareer == null)
            {
                throw new NotFoundException(nameof(TechnicalCareer), request.Id.ToString());
            }

            mapper.Map(request, technicalCareer);

            await careerRepository.Update();
        }
    }
}