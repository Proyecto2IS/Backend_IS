<h1>Backend – Sistema de Gestión de Tutorías Académicas</h1>

<h2>Descripción General</h2>
<p>
El Backend del Sistema de Gestión de Tutorías Académicas se encarga de la lógica
de negocio, la seguridad, la gestión de datos y la exposición de una API REST
que permite la comunicación con el frontend. El sistema está desarrollado
siguiendo una arquitectura MVC y buenas prácticas de desarrollo.
</p>

<h2>Tecnologías Utilizadas</h2>
<ul>
  <li>Node.js</li>
  <li>Express</li>
  <li>MySQL</li>
  <li>Sequelize (ORM)</li>
  <li>JWT (JSON Web Tokens)</li>
  <li>bcrypt</li>
  <li>dotenv</li>
  <li>cors</li>
  <li>nodemon</li>
  <li>Jest y Supertest</li>
</ul>

<h2>Arquitectura del Proyecto</h2>
<p>
El backend sigue una arquitectura MVC (Model–View–Controller), separando
claramente las responsabilidades para facilitar el mantenimiento y escalabilidad.
</p>

<h2>Estructura del Proyecto</h2>
<pre>
backend/
│── config/
│── db/
│── models/
│── controllers/
│── routes/
│── middleware/
│── tests/
│── index.js
│── .env.example
</pre>

<h2>Seguridad</h2>
<ul>
  <li>Autenticación mediante JWT</li>
  <li>Contraseñas encriptadas con bcrypt</li>
  <li>Protección de rutas mediante middleware</li>
  <li>Control de acceso por roles</li>
</ul>

<h2>Módulos Principales</h2>
<ul>
  <li>Autenticación de usuarios</li>
  <li>Gestión de usuarios y roles</li>
  <li>Catálogo de materias</li>
  <li>Disponibilidad del docente</li>
  <li>Gestión completa de tutorías</li>
  <li>Generación de reportes</li>
</ul>

<h2>Pruebas Unitarias</h2>
<p>
Se implementaron pruebas unitarias con Jest para validar controladores,
middlewares y lógica de negocio del sistema.
</p>

<h2>Ejecución del Proyecto</h2>
<pre>
npm install
npm run dev
</pre>

<h2>Desarrolladores Backend</h2>
<ul>
  <li>Emily Yulexi Álava Dueñas – Dev Full Stack</li>
  <li>Elian Israel Zambrano Pinargote – Dev Backend</li>
</ul>
