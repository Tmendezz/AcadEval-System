using AcadEvalSys.Application.Competencies.Commands.CreateCompetency;
using AcadEvalSys.Application.Competencies.Commands.UpdateCompetency;
using AcadEvalSys.Domain.Entities;
using AutoMapper;

namespace AcadEvalSys.Application.Competencies.Dtos;

public class CompetencyProfile : Profile    
{
    public CompetencyProfile()
    {
        CreateMap<CreateCompetencyCommand, Competency>();
        
        CreateMap<UpdateCompetencyCommand, Competency>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // Don't overwrite Id
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore()) // Don't overwrite CreatedAt
            .ForMember(dest => dest.CreatedByUserId, opt => opt.Ignore()) // Don't overwrite CreatedByUserId
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore()) // We'll set this manually
            .ForMember(dest => dest.UpdatedByUserId, opt => opt.Ignore()) // Don't overwrite for now
            .ForMember(dest => dest.IsActive, opt => opt.Ignore()); // Don't overwrite IsActive

        CreateMap<Competency, CompetencyDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.Levels, opt => opt.MapFrom(src => src.LevelDescriptions));

        CreateMap<CompetencyLevelDescription, CompetencyLevelDescriptionDto>();
    }
}