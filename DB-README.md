# Configuración de PostgreSQL con Docker

Este proyecto incluye un archivo `docker-compose.yml` para configurar rápidamente una base de datos PostgreSQL para el sistema AcadEval.

## Requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Servicios incluidos

1. **PostgreSQL**: Base de datos principal

   - Puerto: 5432
   - Usuario: postgres
   - Contraseña: postgres
   - Base de datos por defecto: AcadEvalDB

2. **pgAdmin4**: Interfaz gráfica para administrar PostgreSQL
   - Puerto: 5050
   - Email: 
   - Contraseña: admin

## Inicio rápido

1. Para iniciar los servicios:

```bash
docker-compose up -d
```

2. Para detener los servicios:

```bash
docker-compose down
```

3. Para eliminar todo (incluidos los volúmenes de datos):

```bash
docker-compose down -v
```

## Acceso a pgAdmin

1. Abra un navegador web y vaya a http://localhost:5050
2. Inicie sesión con:

   - Email: admin@acadeval.com
   - Contraseña: admin

3. Para añadir el servidor PostgreSQL en pgAdmin:
   - Haga clic derecho en "Servers" y seleccione "Create" > "Server"
   - En la pestaña "General", asigne un nombre como "AcadEvalDB"
   - En la pestaña "Connection":
     - Hostname: postgres (nombre del servicio en docker-compose)
     - Port: 5432
     - Maintenance database: AcadEvalDB
     - Username: postgres
     - Password: postgres

## Conexión desde la aplicación

En su archivo de configuración de la aplicación (appsettings.json), use la siguiente cadena de conexión:

```json
"ConnectionStrings": {
  "DefaultConnection": "Host=localhost;Port=5432;Database=AcadEvalDB;Username=postgres;Password=postgres"
}
```

Si está ejecutando la aplicación dentro de Docker en la misma red, use "Host=postgres" en lugar de "Host=localhost".

## Personalización

Puede modificar el archivo `docker-compose.yml` para cambiar:

- Versiones de PostgreSQL
- Credenciales
- Puertos
- Volúmenes de datos

Asegúrese de actualizar también la cadena de conexión en su aplicación después de cualquier cambio.
