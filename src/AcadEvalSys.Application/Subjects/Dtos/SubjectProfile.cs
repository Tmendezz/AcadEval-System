using AcadEvalSys.Domain.Entities;
using AutoMapper;
using AcadEvalSys.Application.Subjects.Commands.UpdateSubject;
using AcadEvalSys.Application.Subjects.Commands.CreateSubject;

namespace AcadEvalSys.Application.Subjects.Dtos;

public class SubjectProfile : Profile
{
    public SubjectProfile()
    {
        CreateMap<Subject, SubjectDto>()
            .ForMember(dest => dest.TechnicalCareer, opt => opt.MapFrom(src => src.TechnicalCareer.Name))
            .ForMember(dest => dest.Year, opt => opt.MapFrom(src => src.Year));

        CreateMap<CreateSubjectCommand, Subject>();
        CreateMap<UpdateSubjectCommand, Subject>();


    }
}