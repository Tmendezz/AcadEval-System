using AcadEvalSys.Application.Templates.Dtos;
using AcadEvalSys.Domain.Repositories;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;

namespace AcadEvalSys.Application.Templates.Queries.GetTemplates
{
    public class GetSurveyTemplatesQueryHandler(
        ILogger<GetSurveyTemplatesQueryHandler> logger,
        IMapper mapper,
        ISurveyTemplateRepository surveyTemplateRepository) : IRequestHandler<GetSurveyTemplatesQuery, IEnumerable<SurveyTemplateListItemDto>>
    {
        public async Task<IEnumerable<SurveyTemplateListItemDto>> Handle(GetSurveyTemplatesQuery request, CancellationToken cancellationToken)
        {
            logger.LogInformation("Getting survey templates with filters - Type: {SurveyType}, IsDraft: {IsDraft}, SearchTerm: {SearchTerm}",
                request.SurveyType, request.IsDraft, request.SearchTerm);

            var templates = await surveyTemplateRepository.ListAsync(
                isDraft: request.IsDraft,
                search: request.SearchTerm,
                type: request.SurveyType,
                cancellationToken);

            var result = mapper.Map<IEnumerable<SurveyTemplateListItemDto>>(templates);

            logger.LogInformation("Successfully retrieved {Count} survey templates", result.Count());

            return result;
        }
    }
}