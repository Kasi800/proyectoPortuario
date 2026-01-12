# 🚢 API Portuaria – Puertos y Muelles

Backend RESTful desarrollado con **Node.js**, **Express**, **Sequelize** y **MySQL**.

## 📌 Características principales

- CRUD completo de **Puertos** y **Muelles**
- Validación avanzada con **Joi**
- Filtros dinámicos basados en el modelo
- Ordenación segura (`campo:asc|desc`)
- Paginación (`limit`, `offset`)
- Manejo de errores centralizado
- Logs estructurados
- Arquitectura limpia (controllers, services, validators, middleware)
- Tests automáticos con **Jest + Supertest**

---

## 🛠 Requisitos

- Node.js 18+
- MySQL 8+
- npm o yarn

---

## ⚙️ Instalación

Para instalar las depedencias: **npm install**  
Configura las variables de entorno en **.env** (ejemplo .env.example)

## 📡 Endpoints principales

### Puertos

- GET /api/puertos
- GET /api/puertos/:id
- POST /api/puertos
- PATCH /api/puertos/:id
- PUT /api/puertos/:id
- DELETE /api/puertos/:id

### Muelles

- GET /api/muelles
- GET /api/muelles/:id
- POST /api/muelles
- PATCH /api/muelles/:id
- PUT /api/muelles/:id
- DELETE /api/muelles/:id

## 🔍 Filtros, ordenación y paginación

### Ejemplos:

- GET /api/puertos?ciudad=Sevilla&activo=true
- GET /api/puertos?order=nombre:asc
- GET /api/muelles?tipo=carga&limit=5&offset=10

## 🧱 Validación

- **Body:** Joi (full + partial)

- **Query params:** validación dinámica según el modelo

- **Order:** validación estricta
