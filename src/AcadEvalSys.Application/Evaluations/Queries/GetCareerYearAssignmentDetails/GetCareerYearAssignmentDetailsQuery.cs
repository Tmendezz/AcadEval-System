using AcadEvalSys.Application.Evaluations.Dtos;
using MediatR;

namespace AcadEvalSys.Application.Evaluations.Queries.GetCareerYearAssignmentDetails;

public record GetCareerYearAssignmentDetailsQuery(
    Guid EvaluationId,
    Guid CareerId,
    string Year
) : IRequest<List<CareerYearAssignmentDetailDto>>;