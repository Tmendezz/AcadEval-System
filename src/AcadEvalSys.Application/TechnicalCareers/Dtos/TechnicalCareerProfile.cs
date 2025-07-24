using AcadEvalSys.Application.TechnicalCareers.Commands.CreateTechnicalCareer;
using AcadEvalSys.Application.TechnicalCareers.Commands.UpdateTechnicalCareer;
using AcadEvalSys.Domain.Entities;
using AutoMapper;

namespace AcadEvalSys.Application.TechnicalCareers.Dtos;

public class TechnicalCareerProfile : Profile
{
    public TechnicalCareerProfile()
    {
        CreateMap<TechnicalCareer, TechnicalCareerDto>();
        CreateMap<CreateTechnicalCareerCommand, TechnicalCareer>();
        CreateMap<UpdateTechnicalCareerCommand, TechnicalCareer>();
    }
}