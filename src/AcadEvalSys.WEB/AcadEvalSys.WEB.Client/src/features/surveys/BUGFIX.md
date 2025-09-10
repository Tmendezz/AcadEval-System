# 🐛 Resolución de Problemas - Survey Templates Module

## Problema Identificado
Se detectaron **bucles infinitos** en React que causaban el error:
```
Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate.
```

## 🔧 Soluciones Implementadas

### 1. **Bucle en SurveyTemplateForm** ❌➡️✅

**Problema:**
```tsx
const watchedValues = watch();

useEffect(() => {
  setBasicInfo(watchedValues);
}, [watchedValues, setBasicInfo]);
```

**Solución:**
```tsx
// Sincronización unidireccional del store al form
useEffect(() => {
  setValue("title", title);
  setValue("description", description);
  setValue("surveyType", surveyType);
  setValue("isDraft", isDraft);
}, [title, description, surveyType, isDraft, setValue]);

// Función para manejar cambios y propagar al store
const handleFieldChange = (field: keyof TemplateBasicForm, value: any) => {
  setValue(field, value);
  setBasicInfo({ 
    title: field === "title" ? value : title,
    description: field === "description" ? value : description,
    surveyType: field === "surveyType" ? value : surveyType,
    isDraft: field === "isDraft" ? value : isDraft,
  });
};
```

### 2. **Bucle en QuestionCard** ❌➡️✅

**Problema:**
```tsx
useEffect(() => {
  onUpdate(localQuestion);
}, [localQuestion, onUpdate]);
```

**Solución:**
```tsx
// Solo sincronizar desde el padre
useEffect(() => {
  setLocalQuestion(question);
}, [question]);

// Función controlada para actualizar
const handleQuestionUpdate = (updatedQuestion: CreateSurveyTemplateQuestionRequest) => {
  setLocalQuestion(updatedQuestion);
  onUpdate(updatedQuestion);
};
```

## 🎯 **Principios Aplicados**

✅ **Flujo de datos unidireccional**: Datos fluyen del store → form, cambios van form → store  
✅ **Actualizaciones controladas**: Usar funciones específicas en lugar de `useEffect` reactivos  
✅ **Separación de responsabilidades**: Form maneja UI, Store maneja estado  
✅ **Evitar dependencias circulares**: No usar watches que actualicen su propia fuente  

## 🚀 **Resultado**

- ✅ Sin bucles infinitos
- ✅ Formularios funcionan correctamente
- ✅ Sincronización bidireccional estable
- ✅ Performance optimizada
- ✅ Servidor de desarrollo funcionando sin errores

## 📝 **Lecciones Aprendidas**

1. **`useEffect` con `watch()`** puede crear bucles si actualiza la fuente de datos
2. **Funciones callback** son más seguras que efectos automáticos para sincronización
3. **Testing temprano** ayuda a detectar problemas de performance rápidamente
4. **Separar estado local y global** evita conflictos de sincronización
