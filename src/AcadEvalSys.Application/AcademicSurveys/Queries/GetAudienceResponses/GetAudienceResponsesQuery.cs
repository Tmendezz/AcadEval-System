using AcadEvalSys.Application.AcademicSurveys.Dtos;
using MediatR;

namespace AcadEvalSys.Application.AcademicSurveys.Queries.GetAudienceResponses;

public class GetAudienceResponsesQuery : IRequest<AudienceResponsesDto>
{
    public Guid SurveyId { get; set; }
    public Guid CareerId { get; set; }
    public int Year { get; set; }
}


