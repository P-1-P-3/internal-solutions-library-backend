# Internal Solutions Library (backend)

Backend de la librería interna de soluciones reutilizables.

## Requisitos

- Node.js y npm
- MySQL disponible para la conexión del backend

## Clonar e instalar

```bash
git clone https://github.com/P-1-P-3/internal-solutions-library-backend.git
cd internal-solutions-library-backend
npm install
```

## Configuración local

Crea el archivo `src/.env.development.local` en cada equipo. Este archivo está
ignorado por Git, por lo que no se comparte al clonar el repositorio. No añadas
credenciales reales al repositorio.

Puedes crearlo desde PowerShell:

```powershell
New-Item -ItemType File -Path src\.env.development.local
```

Agrega la configuración de tu entorno, usando los nombres que consume el código:

```dotenv
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base_de_datos
DB_PORT=3306
```

**Importante:** actualmente el proceso de inicio no carga automáticamente
`src/.env.development.local`. Para que esos valores se apliquen, deben estar
disponibles como variables de entorno al iniciar Node.js. Además, el código
espera `DB_USER`, `DB_PASSWORD` y `DB_NAME` (entre otras), no los nombres
`MYSQL_USER`, `MYSQL_PASS` o `MYSQL_DB`.

## Iniciar el backend

```bash
npm run server:mysql
```
