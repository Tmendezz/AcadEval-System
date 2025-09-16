using AcadEvalSys.Application.Students.Commands.AddStudent;
using AcadEvalSys.Application.Students.Commands.UpdateStudent;
using AcadEvalSys.Application.Subjects.Dtos;
using AcadEvalSys.Domain.Entities;
using AutoMapper;

namespace AcadEvalSys.Application.Students.Dtos;

public class StudentProfile : Profile
{
    public StudentProfile()
    {
        // Mapeo de comando a entidad User
        CreateMap<AddStudentCommand, User>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.EmailConfirmed, opt => opt.MapFrom(src => true))
            ;

        CreateMap<AddStudentCommand, Student>()
            .ForMember(dest => dest.CurrentYear, opt => opt.MapFrom(src => src.CurrentYear));

        // Mapeo para actualización de estudiante
        CreateMap<UpdateStudentCommand, Student>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.TechnicalCareerId, opt => opt.MapFrom(src => src.TechnicalCareerId))
            .ForMember(dest => dest.CurrentYear, opt => opt.MapFrom(src => src.CurrentYear));

        // Mapeo de entidad Student a StudentDto
        CreateMap<Student, StudentDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.UserId))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.User!.Name))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.User!.Email))
            .ForMember(dest => dest.TechnicalCareerName, opt => opt.MapFrom(src => src.TechnicalCareer!.Name))
            .ForMember(dest => dest.CurrentYear, opt => opt.MapFrom(src => (int)src.CurrentYear))
            .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => src.User!.EmailConfirmed))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
            .ForMember(dest => dest.EnrolledSubjects, opt => opt.MapFrom(src =>
                (src.StudentSubjects ?? new List<StudentSubject>())
                    .Where(es => es.Subject != null)
                    .Select(es => new SubjectDto
                    {
                        Id = es.Subject!.Id,
                        Name = es.Subject.Name ?? string.Empty,
                        Year = es.Subject.Year,
                    })
            ));
    }
}