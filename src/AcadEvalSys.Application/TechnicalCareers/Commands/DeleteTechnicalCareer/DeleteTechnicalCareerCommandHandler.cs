using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AcadEvalSys.Application.TechnicalCareers.Commands.CreateTechnicalCareer;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.TechnicalCareers.Commands.DeleteTechnicalCareer
{
    public class DeleteTechnicalCareerCommandHandler(ILogger<CreateTechnicalCareerCommandHandler> logger, ITechnicalCareerRepository careerRepository) : IRequestHandler<DeleteTechnicalCareerCommand>
    {
        public async Task Handle(DeleteTechnicalCareerCommand request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Deleting technical career with id {TechnicalCareerId}", request.Id);

            var career = await careerRepository.GetCareerByIdAsync(request.Id);

            if (career == null)
            {
                throw new NotFoundException(nameof(TechnicalCareer), request.Id.ToString());
            }
            career.IsActive = false;
            await careerRepository.Delete(career);
        }
    }
}