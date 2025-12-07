# Instrucciones para obtener el archivo de credenciales de Google Drive

El archivo `sapee-itec-938589ee077d.json` es necesario para que la aplicación se autentique con Google Drive.

## Pasos para obtener el archivo:

1. **Ir a Google Cloud Console**
   - Visita: https://console.cloud.google.com/
   - Selecciona el proyecto correspondiente

2. **Habilitar la API de Google Drive**
   - Ve a "APIs & Services" > "Library"
   - Busca "Google Drive API"
   - Haz clic en "Enable"

3. **Crear un Service Account**
   - Ve a "APIs & Services" > "Credentials"
   - Haz clic en "Create Credentials" > "Service Account"
   - Completa el formulario y crea el service account

4. **Generar la clave JSON**
   - En la lista de Service Accounts, haz clic en el que acabas de crear
   - Ve a la pestaña "Keys"
   - Haz clic en "Add Key" > "Create new key"
   - Selecciona "JSON" como formato
   - Descarga el archivo JSON

5. **Configurar la ruta del archivo**

   Tienes tres opciones para especificar la ubicación del archivo de credenciales (en orden de prioridad):

   **Opción A: Archivo .env (Recomendado para desarrollo)**
   - Crea un archivo `.env` en la raíz del proyecto (donde está el `.gitignore`)
   - Agrega la siguiente línea:
   ```bash
   GOOGLE_DRIVE_CREDENTIALS_PATH=../../../../sapee-itec-75283532858a.json
   ```
   - O con ruta absoluta:
   ```bash
   GOOGLE_DRIVE_CREDENTIALS_PATH=/home/tomiban/Code/EVAC-ITEC/sapee-itec-75283532858a.json
   ```
   - El archivo `.env` se carga automáticamente al iniciar la aplicación
   - ⚠️ El archivo `.env` ya está en `.gitignore`, así que no se subirá al repositorio

   **Opción B: Variable de entorno del sistema (Recomendado para producción)**
   ```bash
   export GOOGLE_DRIVE_CREDENTIALS_PATH="/ruta/completa/al/archivo.json"
   ```
   
   O en Windows:
   ```cmd
   set GOOGLE_DRIVE_CREDENTIALS_PATH=C:\ruta\completa\al\archivo.json
   ```

   **Opción C: Configuración en appsettings.json**
   - Coloca el archivo en la raíz del proyecto (donde está el `.gitignore`)
   - Configura la ruta en `appsettings.json`:
   ```json
   {
     "Storage": {
       "Google": {
         "ServiceAccountCredentialsPath": "../../../../nombre-del-archivo.json"
       }
     }
   }
   ```

   **Nota**: El orden de prioridad es: `.env` > Variable de entorno del sistema > `appsettings.json`

6. **Compartir la carpeta de Google Drive**
   - Ve a Google Drive
   - Abre la carpeta con ID: `0ABcMLGpRmZKRUk9PVA`
   - Comparte la carpeta con el email del Service Account (el `client_email` del JSON)
   - Dale permisos de "Editor" o "Viewer" según necesites

## Estructura del archivo JSON:

El archivo debe tener esta estructura (ver `sapee-itec-938589ee077d.json.template`):

```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...@....iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/...",
  "universe_domain": "googleapis.com"
}
```

## Importante:

- ⚠️ **NUNCA** subas este archivo a Git (ya está en `.gitignore`)
- ⚠️ Mantén este archivo seguro y no lo compartas públicamente
- ⚠️ Si pierdes el archivo, tendrás que crear un nuevo Service Account
- ✅ **Usa variables de entorno en producción** para mayor seguridad
- ✅ La variable de entorno `GOOGLE_DRIVE_CREDENTIALS_PATH` tiene prioridad sobre la configuración en `appsettings.json`

