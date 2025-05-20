# User CRUD - Backend

Este es el backend del sistema CRUD de usuarios y posiciones desarrollado como parte del proyecto de Ingeniería de Software II.

👉 Repositorio del frontend: [User CRUD Frontend](https://github.com/SamKarsa/user-crud-frontend.git)

## 🚀 Descripción

El sistema permite gestionar usuarios y sus posiciones. Está protegido mediante autenticación con JWT y solo usuarios con el rol de **admin** o **supervisor** pueden acceder.

---

## 🔐 Funcionalidades principales

- Login con validación de roles.
- CRUD completo para usuarios y posiciones.
- Validaciones de entrada con Joi.
- Hash de contraseñas con bcryptjs.
- Seguridad con tokens JWT.
- Middleware de autorización por rol.

--- 

## 🧰 Tecnologías y dependencias

- Node.js
- Express
- Sequelize (ORM)
- MySQL
- bcryptjs
- cors
- dotenv
- joi
- jsonwebtoken

---

## 📦 Instalación

1. Clona el repositorio:

```bash
https://github.com/JarolParia/CRUD.git
```

2. Navega al proyecto y descarga las dependencias:

```bash
cd user-crud-backend
npm install
```

3. Crea un archivo .env con la configuración:

```bash
PORT=8080
DB_PORT=3306
DB_NAME=nombre de tu base de datos
DB_USER=tu usuario
DB_PASS=tu contraseña
DB_DIALECT=mysql
DB_HOST=localhost
JWT_SECRET=9d7!A#s2$P0x1Tz&kLmN4@rQ8^vYwZbC
JWT_EXPIRES_IN=1h
```

4. Corre las migraciones y sincroniza la base de datos, agrega esto a la consola:

```bash
npx sequelize-cli db:migrate
```

5. Ejecuta la aplicación en desarrollo:

```bash
npm start
```

Ya con esto, tu backend esta corriendo correctamente. 

---

## 👥 Autores

- [**Samuel López Marín**](https://github.com/SamKarsa)
- [**Jarol Stiben Paria Ramírez**](https://github.com/JarolParia)
- [**Karen Daniela Garzón Morales**](https://github.com/Karencita777)

Todos los desarrolladores participaron activamente en el diseño y desarrollo del **frontend** y **backend** del sistema User CRUD
