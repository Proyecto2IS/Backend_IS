# Backend_IS
Desarrolladores Backend
Emily Yulexi Álava Dueñas – Dev Full Stack
Elian Israel Zambrano Pinargote – Dev Backend
Sistema de Gestión de Tutorías Académicas
escripción General
El Backend del Sistema de Gestión de Tutorías Académicas se encarga de la lógica de negocio, la seguridad, la gestión de datos y la exposición de una API REST que permite la comunicación con el frontend.
Está desarrollado siguiendo una arquitectura MVC, aplicando buenas prácticas de desarrollo, control de versiones y pruebas unitarias.
El sistema permite gestionar usuarios (estudiantes y docentes), materias, disponibilidades, solicitudes de tutoría, confirmaciones, cancelaciones y generación de reportes académicos.
ecnologías Utilizadas
Node.js
Express
MySQL
Sequelize (ORM)
JWT (JSON Web Tokens) – Autenticación y autorización
bcrypt – Encriptación de contraseñas
dotenv – Variables de entorno
cors
nodemon
Jest & Supertest – Pruebas unitarias
Arquitectura
El proyecto sigue una arquitectura MVC (Model–View–Controller) organizada de la siguiente manera:
backend/
│── config/        # Configuraciones generales
│── db/            # Conexión a la base de datos
│── models/        # Modelos Sequelize
│── controllers/   # Lógica de negocio
│── routes/        # Endpoints de la API
│── middleware/    # Autenticación y validaciones
│── tests/         # Pruebas unitarias
│── index.js       # Inicialización del servidor
│── .env.example   # Variables de entorno de ejemplo
Seguridad
Autenticación mediante JWT
Encriptación de contraseñas con bcrypt
Protección de rutas mediante middleware
Control de acceso por roles (estudiante / docente / administrador)
Variables sensibles gestionadas con .env
Módulos Principales
Autenticación (login con correo institucional)
Gestión de Usuarios
Catálogo de Materias
Disponibilidad del Docente
Gestión de Tutorías
Solicitud
Aceptación
Rechazo con alternativas
Confirmación
Cancelación
Reportes
Reportes por estudiante
Reportes semanales
Reportes por docente
Pruebas Unitarias
El backend cuenta con pruebas unitarias implementadas con Jest, cubriendo:
Controladores de autenticación
Middleware de seguridad
Controladores de usuarios
Tutorías
Disponibilidad docente
Reportes
Ejecución del Proyecto
Instalar dependencias:
npm install
Configurar variables de entorno:
cp .env.example .env
Ejecutar el servidor:
npm run dev
npm run dev
