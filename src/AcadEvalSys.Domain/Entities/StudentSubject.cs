using System;

namespace AcadEvalSys.Domain.Entities;

public class StudentSubject : BaseEntity
{
    public string? StudentId { get; set; } 
    public Guid? SubjectId { get; set; }
    
    // Campo para controlar la expiración por año académico
    public int AcademicYear { get; set; }

    public virtual Student? Student { get; set; }
    public virtual Subject? Subject { get; set; }
}
