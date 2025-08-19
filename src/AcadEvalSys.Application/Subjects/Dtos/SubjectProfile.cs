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
            .ForMember(dest => dest.TechnicalCareer, opt => opt.MapFrom(src => src.TechnicalCareer != null ? src.TechnicalCareer.Name : null))
            .ForMember(dest => dest.TechnicalCareerId, opt => opt.MapFrom(src => src.TechnicalCareerId))
            .ForMember(dest => dest.ProfessorName, opt => opt.MapFrom(src => src.Professor != null && src.Professor.User != null ? src.Professor.User.Name : null))
            .ForMember(dest => dest.ProfessorId, opt => opt.MapFrom(src => src.ProfessorId))
            .ForMember(dest => dest.Year, opt => opt.MapFrom(src => src.Year))
            .ForMember(dest => dest.EnrolledStudents, opt => opt.MapFrom(src =>
                src.StudentSubjects != null && src.StudentSubjects.Any() ? src.StudentSubjects.Select(ss => new EnrolledStudentDto
                {
                    StudentId = ss.Student!.UserId!,
                    StudentName = ss.Student.User!.Name,
                    StudentEmail = ss.Student.User.Email,
                    CurrentYear = ss.Student.CurrentYear ?? Domain.Enums.CareerYear.First,
                    TechnicalCareerName = ss.Student.TechnicalCareer != null ? ss.Student.TechnicalCareer.Name : string.Empty
                }).ToList() : null));

        CreateMap<CreateSubjectCommand, Subject>();
        CreateMap<UpdateSubjectCommand, Subject>();
    }
}