# Componentes Reutilizables

Este directorio contiene componentes reutilizables y escalables para mantener consistencia en toda la aplicación.

## Layout Components

### PageLayout

Componente base para todas las páginas que proporciona padding, márgenes y espaciado consistentes.

```tsx
import { PageLayout } from "@/shared/components/ui";

export default function MyPage() {
  return <PageLayout>{/* Contenido de la página */}</PageLayout>;
}
```

### PageHeader

Header consistente para páginas con título, descripción y acciones.

```tsx
<PageHeader title="Mi Página" description="Descripción de la página">
  <Button>Acción</Button>
</PageHeader>
```

### PageContent & PageSection

Organizadores de contenido con espaciado consistente.

```tsx
<PageContent>
  <PageSection>{/* Contenido de la sección */}</PageSection>
</PageContent>
```

## UI Components

### StatCard

Tarjeta para mostrar estadísticas con icono, valor y descripción.

```tsx
<StatCard
  title="Total Usuarios"
  value={1234}
  description="Usuarios activos"
  icon={<Users className="h-4 w-4" />}
  trend={{ value: 12, isPositive: true }} // Opcional
/>
```

### EntityCard

Tarjeta para entidades (carreras, asignaturas, etc.) con estadísticas y acciones.

```tsx
<EntityCard
  title="Desarrollo de Software"
  subtitle="Tecnicatura Superior"
  badge={{ text: "150 alumnos", variant: "secondary" }}
  stats={[
    {
      icon: <Users className="w-4 h-4" />,
      label: "Estudiantes",
      value: "150 estudiantes",
    },
  ]}
  onClick={() => handleClick()}
/>
```

### FilterTabs

Filtros de pestañas reutilizables con contadores.

```tsx
<FilterTabs
  options={[
    { value: "year1", label: "1º Año", count: 5, active: true },
    { value: "year2", label: "2º Año", count: 3, active: false },
  ]}
  onFilterChange={(value) => setFilter(value)}
/>
```

### LoadingState & EmptyState

Estados de carga y vacío consistentes.

```tsx
<LoadingState message="Cargando datos..." size="md" />
<EmptyState
  title="No hay datos"
  description="No se encontraron resultados"
  icon={<BookOpen className="w-12 h-12" />}
/>
```

### AssignmentPanel

Panel para asignar/desasignar entidades (profesores, estudiantes, etc.).

```tsx
<AssignmentPanel
  title="Profesor Actual"
  icon={<UserCheck className="w-5 h-5" />}
  currentAssignment={currentProfessor}
  availableOptions={availableProfessors}
  onAssign={handleAssign}
  selectedId={selectedId}
  onSelectedIdChange={setSelectedId}
  isLoading={isLoading}
/>
```

### DataSection

Sección de datos con tabla, estados de carga y vacío integrados.

```tsx
<DataSection
  title="Lista de Estudiantes"
  description="Estudiantes inscritos en la asignatura"
  data={students}
  columns={columns}
  isLoading={isLoading}
  emptyMessage="No hay estudiantes inscritos"
  emptyIcon={<Users className="w-12 h-12" />}
  onRowClick={handleRowClick}
/>
```

## Beneficios de la Componentización

### 1. **Consistencia Visual**

- Todos los componentes siguen el mismo diseño y espaciado
- Cambios de diseño se aplican globalmente
- Experiencia de usuario uniforme

### 2. **Reutilización**

- Componentes pueden usarse en múltiples páginas
- Reducción de código duplicado
- Mantenimiento más fácil

### 3. **Escalabilidad**

- Fácil agregar nuevas páginas con el mismo patrón
- Componentes extensibles con props adicionales
- Arquitectura modular

### 4. **Mantenibilidad**

- Cambios centralizados en componentes
- Testing más fácil con componentes aislados
- Documentación clara de props y uso

## Patrones de Uso

### Estructura de Página Típica

```tsx
export default function MyPage() {
  return (
    <PageLayout>
      <PageHeader title="Mi Página" description="Descripción">
        <Button>Acción</Button>
      </PageHeader>

      <PageContent>
        <PageSection>
          <StatCard ... />
        </PageSection>

        <PageSection>
          <DataSection ... />
        </PageSection>
      </PageContent>
    </PageLayout>
  );
}
```

### Componentes de Datos

```tsx
// Definir columnas
const columns: ColumnDef<MyType>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <CustomCell data={row.original} />,
  },
];

// Usar en DataSection
<DataSection
  title="Mi Lista"
  data={myData}
  columns={columns}
  isLoading={isLoading}
/>;
```

## Extensión

Para agregar nuevos componentes:

1. Crear el componente en `src/shared/components/ui/`
2. Agregar al archivo de índice `index.ts`
3. Documentar props y uso
4. Seguir el patrón de diseño establecido
5. Usar `cn()` para clases condicionales
6. Incluir tipos TypeScript completos
