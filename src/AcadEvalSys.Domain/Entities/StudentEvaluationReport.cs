using System;
using System.Collections.Generic;

namespace AcadEvalSys.Domain.Entities
{
    public class StudentEvaluationReport : BaseEntity
    {
        public string StudentId { get; set; } = null!;
        public Guid CompetencyEvaluationInstanceId { get; set; }
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public string? GeneratedByUserId { get; set; }
        public string? Observation { get; set; } // Observación opcional del coordinador
        
        // Azure Blob Storage fields - OPTIMIZADOS
        public string? BlobName { get; set; } // Nombre único del blob en Azure Storage
        public string ContainerName { get; set; } = "reports"; // Default al contenedor de reportes
        // ELIMINADO: public string? BlobUrl { get; set; } // Ya no se usa con URLs privadas
        
        // Metadatos adicionales útiles
        public long? FileSizeBytes { get; set; } // Tamaño del archivo
        public string? ContentType { get; set; } = "application/pdf"; // Tipo de contenido
        
        public virtual Student Student { get; set; } = null!;
        public virtual CompetencyEvaluationInstance CompetencyEvaluationInstance { get; set; } = null!;
    }
}