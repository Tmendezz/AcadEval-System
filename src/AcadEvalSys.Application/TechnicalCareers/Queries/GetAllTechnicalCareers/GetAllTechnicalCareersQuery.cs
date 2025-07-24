using AcadEvalSys.Application.TechnicalCareers.Dtos;
using MediatR;

namespace AcadEvalSys.Application.TechnicalCareers.Queries.GetAllTechnicalCareers;

public class GetAllTechnicalCareersQuery : IRequest<IEnumerable<TechnicalCareerDto>>
{

}