# Flujo de Evaluación de Competencias

## Descripción General
La evaluación de competencias es un período donde cada profesor tiene asignado evaluar a los alumnos de su asignatura. El período finaliza cuando se cumple el último día de cierre **Y** todos los profesores han terminado sus evaluaciones.

## Entidades Principales

### 1. CompetencyEvaluationInstance (Período de Evaluación)
- **Estado inicial**: `Pending`
- **Estado final**: `Completed`
- Tiene fechas de inicio (`PeriodFrom`) y fin (`PeriodTo`)
- Contiene múltiples `ProfessorCompetencyAssignment`

### 2. ProfessorCompetencyAssignment (Asignación a Profesor)
- **Estado inicial**: `Pending`
- **Estado final**: `Completed`
- Representa la responsabilidad de un profesor de evaluar una competencia específica
- Contiene múltiples `StudentCompetencyAssessment`

### 3. StudentCompetencyAssessment (Evaluación Individual)
- **Estado inicial**: `Pending`
- **Estado final**: `Completed`
- Representa la evaluación de un estudiante específico por parte de un profesor

## Flujo de Completación

### Paso 1: Profesor Evalúa Estudiante
```csharp
// Endpoint: POST /api/professor/assignments/{assignmentId}/students/{studentId}/evaluate
// Handler: CompleteStudentAssessmentCommandHandler
```

1. El profesor evalúa a un estudiante específico
2. `StudentCompetencyAssessment` cambia de `Pending` → `Completed`
3. Se registra el nivel de competencia alcanzado
4. Se llama automáticamente a `EvaluationCompletionService.CheckAndCompleteAssignmentAsync()`

### Paso 2: Verificación de Asignación Completa
```csharp
// Service: EvaluationCompletionService.CheckAndCompleteAssignmentAsync()
```

**Condición**: Todas las evaluaciones de estudiantes están `Completed`
- Si ✅: `ProfessorCompetencyAssignment` cambia a `Completed`
- Si ❌: Mantiene estado `Pending`

### Paso 3: Finalización Manual por Administrador
```http
// Endpoint: POST /evaluation-instances/{instanceId}/finalize?forceClose=false
// Handler: FinalizeEvaluationInstanceCommandHandler
```

**Control Administrativo**: Solo los administradores pueden finalizar las evaluaciones
- **Verificación normal**: Todos los profesores deben haber completado sus asignaciones
- **ForceClose=true**: Permite cerrar aunque falten profesores por completar
- **Auditoría**: Se registra quién y cuándo finalizó la evaluación

Si ✅: `CompetencyEvaluationInstance` cambia a `Completed`

## Servicios Principales

### IEvaluationCompletionService
```csharp
public interface IEvaluationCompletionService
{
    // Verifica si profesor completó todas sus evaluaciones
    Task<bool> CheckAndCompleteAssignmentAsync(Guid professorCompetencyAssignmentId);
    
    // Verifica si período puede completarse (período + profesores completos)
    Task<bool> CheckEvaluationInstanceCompletionConditionsAsync(Guid evaluationInstanceId);
    
    // Cierra período expirado independientemente del estado
    Task<bool> CheckAndCloseExpiredInstanceAsync(Guid evaluationInstanceId);
}
```

## Endpoints Principales

### Para Profesores
```http
GET /api/professor/{professorId}/assignments
# Lista todas las asignaciones del profesor

GET /api/professor/assignments/{assignmentId}/students
# Lista estudiantes para evaluar en una asignación específica

POST /api/professor/assignments/{assignmentId}/students/{studentId}/evaluate
# Evalúa un estudiante específico
```

### Para Administradores
```http
POST /evaluation-instances/{instanceId}/finalize
# Finaliza manualmente una instancia de evaluación

POST /evaluation-instances/{instanceId}/finalize?forceClose=true
# Fuerza el cierre aunque no todos los profesores hayan completado
```

## Estados de Completación

| Nivel | Entidad | Condición | Resultado | Trigger |
|-------|---------|-----------|-----------|----------|
| 1 | `StudentCompetencyAssessment` | Profesor evalúa estudiante | `Pending` → `Completed` | Automático |
| 2 | `ProfessorCompetencyAssignment` | Todas las evaluaciones de estudiantes completas | `Pending` → `Completed` | Automático |
| 3 | `CompetencyEvaluationInstance` | Administrador ejecuta finalize | `Pending` → `Completed` | **Manual** |

## Notas Importantes

1. **Automático**: El sistema verifica automáticamente las condiciones de completación después de cada evaluación
2. **Periodo + Profesores**: Una instancia solo se completa cuando AMBAS condiciones se cumplen
3. **No reversible**: Una vez marcado como `Completed`, no cambia de estado
4. **Trazabilidad**: Todos los cambios de estado se registran en logs para auditoría
