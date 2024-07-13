# Índice

1. [Introducción](#introducción)
2. [Características](#características)
3. [Interfaz de Usuario](#interfaz-de-usuario)
4. [Contribuir](#contribuir)
5. [Para el Desarrollador](#para-el-desarrollador)
6. [Documentación API](#documentación-api)
7. [Recordatorios](#Recordatorio)


---

# Introducción

## Tecnologías Utilizadas
La aplicación web está desarrollada en el backend con PHP usando **Slim Framework** para las API REST. Para la capa de datos se utilizó **MySQL** y en el frontend **Angular**. Cada una de estas capas está separada por contenedores en **Docker**. Para la seguridad de las APIs se utilizó **JWT**, entre otras dependencias de PHP.

## Sistema de Reservación de Hoteles
Este sistema web permite a los clientes reservar habitaciones en un hotel. Las reservaciones se cobran por noche, contando desde el día de la reservación hasta las 12 PM del día siguiente.

---

# Características

## Roles y Permisos

### Administrador
- Puede modificar, agregar, eliminar, actualizar y acceder a cualquier recurso y funcionalidad del sistema.
- Tiene acceso completo a todas las funcionalidades y datos del sistema.

### Recepcionista
- Puede modificar, agregar, eliminar, actualizar y acceder a los recursos de habitaciones y reservaciones.
- Puede realizar reservaciones en nombre de los clientes.
- Gestiona las reservas y la disponibilidad de las habitaciones.

### Cliente
- Puede realizar reservaciones de habitaciones.
- Puede cancelar sus propias reservaciones.
- Solo puede ver las reservaciones que ha hecho él mismo.

---

# Interfaz de Usuario

### Login
![Texto alternativo](https://github.com/AlbinJunLiang/reservacion-hotel/blob/main/img/login.png?raw=true)

### Home
![Texto alternativo](https://github.com/AlbinJunLiang/reservacion-hotel/blob/main/img/home.png?raw=true)

### Gestión
![Texto alternativo](https://github.com/AlbinJunLiang/reservacion-hotel/blob/main/img/gestion.png?raw=true)

---

# Contribuir
(Incluir aquí las directrices para contribuir al proyecto, si las hay.)

---

# Para el Desarrollador

1. Tener Docker-Desktop, PHP, Node.js, Angular, Composer, Slim Framework, etc.
2. Descargar el proyecto y descomprimirlo.
3. Descomprimir la carpeta de presentación y asegurarse de que esté al mismo nivel que las carpetas de datos y negocios.
4. Abrir la consola o CMD y dirigirse a la ubicación de la carpeta de presentación, luego ejecutar el comando `npm install`.
5. Abrir la carpeta de datos y realizar `composer install`. Puede ser necesario hacerlo también en la carpeta de negocios.
6. Ejecutar el comando `docker-compose up --build -d` en la ubicación de la carpeta de datos.
7. Probar la aplicación en `localhost:80`. Si no funciona, ir a la carpeta de presentación y ejecutar `ng serve -p`.
8. El administrador o superusuario del sistema es `55` con contraseña `55`.

---

# Documentación API

Para más detalles sobre la API, consulta la [Documentación de la API](https://github.com/AlbinJunLiang/reservacion-hotel/blob/main/documentacion.pdf).

---

# Recordatorio
- No se creo un diagrama de componentes.
- No hay manual de usuario especifico del sistema
- El superusuario del sistema es 55 y su contraseña es 55.
- La funcionalidad de cambiar rol no está.
- Los administradores pueden modificar datos de otros administradores (esto es importante arreglarlo).
- El usuario puede ser el id numérico o el correo.
- Solo se puede reservar por noches (Deberia asignarse por cualquier rango de fecha válido y deseado por el cliente).
- El cliente no puede registrarse en el sistema, debe solictarlo al recepcionista o administrador.
- El cliente no puede ver las habitaciones ocupadas y tampoco las reservaciones que no son propias de el.

