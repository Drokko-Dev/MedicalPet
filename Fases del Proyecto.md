# Fases del Proyecto

# Fase 1: Setup y estructura base

## Docker y entorno (DevOps)
Crear docker-compose.yml con servicios: frontend, backend, db (PostgreSQL), pgAdmin
Configurar variables de entorno con .env y .env.example para cada servicio
Crear Dockerfile para backend (Python 3.12 slim) y frontend (Node 20 + Vite)

## Backend — FastAPI (Backend)
Inicializar proyecto FastAPI con estructura: app/routers, app/models, app/schemas, app/services
Instalar dependencias: fastapi, uvicorn, sqlalchemy, alembic, psycopg2, python-jose, passlib, python-multipart
Configurar conexión a PostgreSQL con SQLAlchemy y el DATABASE_URL desde env
Inicializar Alembic para migraciones: alembic init alembic y configurar env.py
Agregar CORS en FastAPI para aceptar peticiones desde localhost:5173 en desarrollo

## Frontend — React + TypeScript (Frontend)
Crear proyecto con Vite + React + TypeScript: npm create vite@latest
Instalar dependencias: react-router-dom, axios, @tanstack/react-query, zustand, tailwindcss
Configurar Tailwind CSS con paleta de colores del diseño (verde #1D9E75, azul #185FA5)
Crear estructura de carpetas: src/pages, src/components, src/hooks, src/api, src/store, src/types

# Fase 2: Autenticación y Modelo de datos

## Modelos de base de datos (Backend)
Modelo User: id, email, hashed_password, full_name, role (owner/vet), created_at
Modelo Pet: id, owner_id (FK), name, species, breed, sex, birth_date, weight, microchip, color, notes, photo_url
Modelo Clinic: id, name, address, phone, rut, created_at
Modelo Vet: id, user_id (FK), clinic_id (FK), license_number, specialty
Modelo MedicalRecord: id, pet_id (FK), vet_id (FK nullable), clinic_id (FK nullable), type (vaccine/consult/exam/manual), title, diagnosis, treatment, notes, date, is_manual, created_at
Modelo RecordAttachment: id, record_id (FK), file_url, file_type, file_name
Modelo Vaccine: id, record_id (FK), vaccine_name, brand, batch, next_dose_date
Crear migración inicial con Alembic y verificar en pgAdmin

## Autenticación JWT (Backend)
Endpoint POST /auth/register con validación de email único y hash de contraseña con bcrypt
Endpoint POST /auth/login que retorna access_token JWT con el rol del usuario en el payload
Dependency get_current_user para proteger rutas y require_role("vet") para rutas exclusivas

## Frontend — auth (Frontend)
Páginas LoginPage y RegisterPage con formularios validados (react-hook-form + zod)
Store de autenticación en Zustand: guardar token JWT en localStorage, leer rol del payload
Configurar Axios con interceptor que agrega el header Authorization: Bearer token
Componente PrivateRoute que redirige a login si no hay token, y RoleRoute según rol
Redirección automática post-login: dueño → /dashboard, veterinario → /vet/dashboard

# Fase 3: Vista del dueño - CRUD Completo

## API — mascotas (Backend)
GET /pets — lista las mascotas del dueño autenticado
POST /pets — crear mascota con subida de foto (multipart/form-data, guardar en /uploads)
PUT /pets/{id} y DELETE /pets/{id} — editar y eliminar (solo el dueño de la mascota)
GET /pets/{id}/records — historial médico completo con filtros por type y fecha
POST /pets/{id}/records — crear registro manual (is_manual=True, sin vet ni clinic)
GET /pets/{id}/qr-token — genera un token temporal firmado (exp 15 min) para compartir la ficha

## Frontend — páginas dueño (Frontend)
Navbar verde con links: Inicio, Mis mascotas, Agenda, Alertas + avatar + logout
DashboardPage: resumen de mascotas, últimos registros, próximas vacunas
PetsPage: grid de tarjetas de mascotas + formulario inline para agregar nueva
PetDetailPage: ficha completa con timeline de registros, filtros por tipo, buscador
Modal para agregar registro manual: tipo, título, fecha, notas, subir adjunto (PDF/imagen)
Componente QRShare: genera QR con la librería qrcode.react mostrando el token temporal
AlertsPage: lista de vacunas próximas a vencer calculadas desde la tabla Vaccine

# Fase 4: Vista del veterinario - panel clinico

## API — veterinario (Backend)
GET /vet/patients — lista todas las mascotas que han sido atendidas en la clínica del vet autenticado
GET /pets/by-qr-token/{token} — endpoint público que valida el token temporal y retorna la ficha completa
POST /vet/records/{pet_id} — crear registro médico asociado al vet y clinic autenticados (is_manual=False)
POST /records/{id}/attachments — subir archivos adjuntos (PDF, JPG, PNG) con validación de tipo y tamaño máx 10MB
GET /vet/alerts — vacunas vencidas o próximas a vencer de todos los pacientes de la clínica

## Frontend — páginas veterinario (Frontend)
Navbar azul con links: Inicio, Pacientes, Agenda, Reportes + nombre del centro + badge de alertas
VetDashboardPage: métricas del día, lista de pacientes, alertas críticas (alergias, vacunas)
PatientsPage: tabla de pacientes con búsqueda, filtros y acceso a ficha individual
Componente QRScanner: usar html5-qrcode para activar la cámara y leer el código del dueño
Formulario de nueva consulta: motivo, diagnóstico, tratamiento, peso, temperatura + adjuntar archivos
Formulario específico de vacuna: nombre, marca, lote, fecha próxima dosis (crea Vaccine + MedicalRecord)

# Fase 5: Pulido, Seguridad y permisos

## Seguridad y permisos (Backend)
Validar en cada endpoint que el usuario autenticado solo accede a sus propios datos (un vet no ve pacientes de otra clínica)
Rate limiting en endpoints de auth con slowapi para evitar ataques de fuerza bruta
Endpoint DELETE /users/me que elimina cuenta y todos sus datos (derecho a eliminación — Ley 21.719)
Cifrado de archivos adjuntos sensibles en reposo (AES-256 en el servidor o usar S3 con SSE)

## Consentimiento y legal (Legal)
Modal de consentimiento en el registro: qué datos se guardan, con quién se comparten, derecho a eliminar
Página de Términos y Condiciones + Política de Privacidad (cumplimiento Ley 21.719)

## Deploy y producción (DevOps)
Configurar docker-compose.prod.yml con Nginx como reverse proxy para frontend y backend
Variables de entorno de producción: SECRET_KEY fuerte, DATABASE_URL con credenciales seguras, ALLOWED_ORIGINS
Configurar backups automáticos de PostgreSQL (pg_dump programado con cron dentro del contenedor)
Certificado SSL con Let's Encrypt + Certbot para HTTPS obligatorio en producción