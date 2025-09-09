using AcadEvalSys.Application.Templates.Dtos;
using AcadEvalSys.Domain.Entities;
using AcadEvalSys.Domain.Exceptions;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Templates.Queries.GetTemplateById
{
    public class GetSurveyTemplateByIdQueryHandler(
        ILogger<GetSurveyTemplateByIdQueryHandler> logger,
        IMapper mapper,
        ISurveyTemplateRepository surveyTemplateRepository) : IRequestHandler<GetSurveyTemplateByIdQuery, SurveyTemplateReadDto>
    {
        public async Task<SurveyTemplateReadDto> Handle(GetSurveyTemplateByIdQuery request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Getting survey template with ID: {Id}", request.Id);

            var template = await surveyTemplateRepository.GetTemplateByIdAsync(request.Id, includeChildren: true, cancellationToken);

            if (template == null)
            {
                logger.LogWarning("Survey template with ID: {Id} not found", request.Id);
                throw new NotFoundException(nameof(SurveyTemplate), request.Id.ToString());
            }

            var result = mapper.Map<SurveyTemplateReadDto>(template);

            logger.LogInformation("Survey template with ID: {Id} retrieved successfully", request.Id);

            return result;
        }
    }
}