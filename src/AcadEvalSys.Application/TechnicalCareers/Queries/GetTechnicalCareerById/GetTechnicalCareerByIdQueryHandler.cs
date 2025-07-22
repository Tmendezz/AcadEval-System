using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AcadEvalSys.Application.TechnicalCareers.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.TechnicalCareers.Queries.GetTechnicalCareerById
{
    public class GetTechnicalCareerByIdQueryHandler(ILogger<GetTechnicalCareerByIdQueryHandler> logger, IMapper mapper, ITechnicalCareerRepository careerRepository) : IRequestHandler<GetTechnicalCareerByIdQuery, TechnicalCareerDto>
    {
        public async Task<TechnicalCareerDto> Handle(GetTechnicalCareerByIdQuery request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Getting technical career {TechnicalCareerId}", request.Id);
            var career = await careerRepository.GetCareerByIdAsync(request.Id)
                ?? throw new NotFoundException(nameof(TechnicalCareer), request.Id.ToString());

            var careerDto = mapper.Map<TechnicalCareerDto>(career);

            return careerDto;
        }
    }
}