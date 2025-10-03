# FlypyApp — Plataforma de Cursos Python Universitaria

## Descripción del proyecto

FlipiApp — Plataforma de Cursos Python Universitaria permite a estudiantes y docentes crear y consumir cursos estructurados en tópicos ricos en multimedia. Cada tópico puede contener texto, imágenes (Cloudinary), videos (YouTube o Cloudinary), transcripción, slides y audio. Incluye autenticación, gestión de cursos, editor de contenidos, y un playground interactivo para ejecutar código Python en el navegador.

---

## Características principales

- **Gestión de usuarios**: registro, login, OAuth, roles (estudiante/docente/admin)
- **Creación y gestión** de cursos y módulos
- **Tópicos ricos en contenido**: texto, imágenes, video, transcripción, slides (PDF), audio
- **Integración con Cloudinary** para almacenar multimedia
- **Integración con YouTube API** para videos externos
- **Playground interactivo**: ejecución de Python en navegador con Pyodide
- **Comunicación en tiempo real** del playground (Socket.io) para features colaborativos
- **Notificaciones por correo** (Nodemailer) y recuperación de contraseña
- **API REST segura** (JWT) y uploads con Multer
- **Testing** (Jest + React Testing Library)
- **CI/CD** (GitHub Actions)
- **Contenedores** (Docker)

---

## Stack tecnológico

### Frontend

- **React** 18.3.1
- **Tailwind CSS** 3.4.17
- **Pyodide** 0.28.3 (ejecución Python en navegador)
- **Monaco Editor** 4.6.0 (editor de código)

### Backend

- **Node.js** 20.19.5 LTS
- **Express** 5.x
- **Socket.io** 4.x
- **jsonwebtoken** (JWT)
- **Multer** 2.0.1
- **OAuth** 0.12.2

### Base de datos

- **PostgreSQL** 15
- **Prisma** (ORM)

### Servicios externos

- **Cloudinary** (imágenes / videos / slides opcionales)
- **YouTube API** (videos embebidos)
- **Nodemailer** (correos)

### DevOps / Testing

- **Git / GitHub**, GitHub Projects (Kanban)
- **Docker**
- **GitHub Actions** (CI/CD)
- **Jest** + React Testing Library
- **ESLint**