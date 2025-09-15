# Manual de Usuario - Sistema EVAC ITEC

## 1. Introducción

Bienvenido al Sistema EVAC ITEC, una plataforma digital diseñada para transformar la manera en que las instituciones educativas gestionan la evaluación por competencias. Nuestro objetivo es facilitar el seguimiento del progreso de los alumnos, optimizar la carga de trabajo de los docentes y ofrecer a los directivos información clara y precisa para la toma de decisiones.

Este manual te guiará a través de todas las funcionalidades del sistema, seas administrador, coordinador, profesor o alumno.

## 2. Roles de Usuario

El sistema está diseñado para adaptarse a las necesidades de cada miembro de la comunidad educativa a través de cuatro roles principales:

- **Administrador**: Tiene el control total del sistema. Su función es configurar la plataforma, gestionar los usuarios y garantizar que todo funcione correctamente.
- **Coordinador**: Es el responsable de la gestión académica. Se encarga de crear y organizar las carreras, asignar materias, inscribir alumnos y definir las competencias a evaluar.
- **Profesor**: Es el encargado de evaluar a los alumnos. Utiliza la plataforma para calificar las competencias de sus estudiantes y proporcionar feedback.
- **Alumno**: Es el centro del proceso educativo. Puede consultar sus resultados, ver su progreso a lo largo del tiempo y recibir la retroalimentación de sus profesores.

---

## 3. Guía para Administradores

Como administrador, tienes acceso a todas las herramientas necesarias para configurar y mantener el sistema.

### 3.1. Primeros Pasos

Al ingresar por primera vez, te recomendamos:
1.  **Configurar los datos de la institución**: Nombre, logo y otros datos de contacto.
2.  **Crear los usuarios coordinadores**: Ellos serán los encargados de la gestión académica.
3.  **Establecer el primer período de evaluación**: Define las fechas en las que los profesores podrán evaluar.

### 3.2. Gestión de Usuarios

En la sección "Usuarios", podrás:
- **Crear un nuevo usuario**:
    1.  Haz clic en "Crear Usuario".
    2.  Completa los datos: nombre, apellido, email y rol (Coordinador, Profesor, etc.).
    3.  El sistema enviará un correo de bienvenida al nuevo usuario con un enlace para que establezca su contraseña.
- **Buscar y filtrar usuarios**: Utiliza la barra de búsqueda para encontrar a un usuario por su nombre o email.
- **Editar un usuario**: Modifica el rol, el estado (activo/inactivo) o cualquier otro dato.
- **Eliminar un usuario**: Ten en cuenta que esta acción es irreversible.

### 3.3. Configuración del Sistema

En "Configuración", podrás ajustar:
- **Períodos de Evaluación**:
    - **Crear un período**: Define un nombre (ej. "Primer Cuatrimestre 2025"), las fechas de inicio y fin.
    - **Configurar notificaciones**: Puedes hacer que el sistema envíe correos automáticos a los profesores al iniciar el período, recordatorios a mitad de camino y una notificación de cierre.
- **Plantillas de Correo**: Personaliza el texto de los correos que envía el sistema.

### 3.4. Reportes y Estadísticas

El sistema te ofrece una visión global del proceso de evaluación:
- **Reporte de avance de evaluación**: Visualiza qué porcentaje de las evaluaciones se han completado en tiempo real.
- **Estadísticas de uso**: Conoce cuántos usuarios han ingresado al sistema, cuántas evaluaciones se han realizado, etc.

---

## 4. Guía para Coordinadores

Como coordinador, tu rol es organizar la estructura académica y asegurar que el proceso de evaluación se lleve a cabo correctamente.

### 4.1. Primeros Pasos

1.  **Crea las carreras técnicas** que se imparten en la institución.
2.  **Define las asignaturas** para cada carrera y año.
3.  **Asigna los profesores** a cada asignatura.
4.  **Inscribe a los alumnos** en las asignaturas correspondientes.
5.  **Crea las competencias** que serán evaluadas.

### 4.2. Gestión Académica

- **Carreras Técnicas**:
    - **Crear**: Ingresa el nombre y un código único.
    - **Editar**: Modifica el nombre o el coordinador a cargo.
- **Asignaturas**:
    - **Crear**: Define el nombre, el año al que pertenece (1º, 2º, 3º) y el profesor que la impartirá.
- **Alumnos**:
    - **Inscripción masiva**: Sube un archivo CSV con la lista de alumnos para inscribirlos a todos a la vez en una asignatura.
    - **Inscripción manual**: Inscribe a un alumno de forma individual.

### 4.3. Gestión de Competencias

Esta es una de las partes más importantes de tu rol.
- **Crear una competencia**:
    1.  Ve a "Competencias" y haz clic en "Nueva".
    2.  Define un nombre (ej. "Trabajo en Equipo"), una descripción y el tipo (transversal, técnica, etc.).
    3.  Asóciala a una o varias carreras y años.
- **Crear el formulario de evaluación**:
    1.  Dentro de cada competencia, añade las preguntas que los profesores usarán para evaluar.
    2.  Las preguntas son del tipo "escala de 1 a 5". Por ejemplo: "El alumno colabora activamente con sus compañeros".

### 4.4. Seguimiento de Evaluaciones

En tu panel principal, podrás ver:
- **Progreso en tiempo real**: Un gráfico que muestra cuántos profesores han completado sus evaluaciones.
- **Alertas**: El sistema te notificará si un profesor está atrasado o si hay algún problema.

---

## 5. Guía para Profesores

Tu rol es evaluar el desempeño de tus alumnos en las competencias definidas.

### 5.1. Panel del Profesor

Al iniciar sesión, verás:
- **Evaluaciones pendientes**: Una lista de las asignaturas y competencias que tienes que evaluar.
- **Fechas límite**: El sistema te recordará hasta cuándo tienes tiempo para completar cada evaluación.

### 5.2. El Proceso de Evaluación

1.  **Selecciona una asignatura y competencia**: Elige de tu lista de evaluaciones pendientes.
2.  **Lista de alumnos**: Verás a todos los alumnos que debes evaluar.
3.  **Evaluar a un alumno**:
    - Haz clic en "Evaluar" al lado del nombre de un alumno.
    - Se abrirá el formulario con las preguntas definidas por el coordinador.
    - **Califica cada pregunta** de 1 a 5.
    - **Añade un comentario general** (opcional pero recomendado) para dar un feedback más completo.
4.  **Guardar y finalizar**:
    - **Guardar como borrador**: Si no has terminado, puedes guardar tu progreso y continuar más tarde. El alumno no verá la evaluación todavía.
    - **Finalizar evaluación**: Una vez que estés seguro de tus calificaciones, finaliza la evaluación. En este momento, el alumno será notificado y podrá ver sus resultados.

### 5.3. Historial de Evaluaciones

En la sección "Historial", podrás consultar todas las evaluaciones que has realizado en períodos anteriores.

---

## 6. Guía para Alumnos

Como alumno, la plataforma te permite conocer tu desempeño y recibir feedback para tu mejora continua.

### 6.1. Tu Panel Principal

Al ingresar, verás:
- **Últimas evaluaciones recibidas**: Un resumen de las calificaciones más recientes.
- **Promedio general**: Tu promedio de calificaciones en todas las competencias.

### 6.2. Consulta de Evaluaciones

1.  Ve a la sección "Mis Evaluaciones".
2.  Verás una lista de todas las competencias en las que has sido evaluado.
3.  **Haz clic en una evaluación** para ver los detalles:
    - **Calificación final**: El puntaje promedio que te asignó el profesor.
    - **Detalle por pregunta**: La calificación que recibiste en cada uno de los ítems evaluados.
    - **Comentarios del profesor**: Lee el feedback que te ha dejado tu profesor para saber en qué puedes mejorar.

### 6.3. Tu Progreso

En la sección "Mi Progreso", podrás ver gráficos que muestran tu evolución a lo largo del tiempo en las diferentes competencias.

## 7. Preguntas Frecuentes (FAQ)

- **¿Qué pasa si olvido mi contraseña?**
  - En la pantalla de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?" y sigue las instrucciones para recuperarla.

- **(Profesor) ¿Puedo modificar una evaluación finalizada?**
  - No. Una vez que una evaluación es finalizada, no se puede modificar. Si cometiste un error, contacta al coordinador de tu carrera.

- **(Coordinador) ¿Puedo inscribir a un alumno a mitad del período de evaluación?**
  - Sí, pero el profesor deberá ser notificado para que realice la evaluación correspondiente.

## 8. Soporte

Si tienes algún problema o duda que no esté resuelta en este manual, por favor, contacta al administrador del sistema en tu institución.