using AcadEvalSys.Application.Professors.Commands.AddProfessor;
using AcadEvalSys.Application.Professors.Dtos;
using AcadEvalSys.Domain.Entities;
using AutoMapper;

namespace AcadEvalSys.Application.Professors.Dtos;

public class ProfessorProfile : Profile
{
    public ProfessorProfile()
    {
        CreateMap<AddProfessorCommand, User>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email));

        CreateMap<Professor, ProfessorDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.User!.Name))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User!.Email));
    }
}
