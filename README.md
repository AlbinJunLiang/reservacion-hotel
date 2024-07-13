# Índice

1. [Introducción](#introducción)
2. [Características](#características)
3. [Interfaz de usuario](#Aplicación)
5. [Contribuir](#contribuir)
6. [Para el desarrollador](#Implementacion)

# introducción

## Tecnologías utilizadas
La aplicación web esta desarrollda en el backend con PHP **(Slim-Framework)** para las API-REST, para la capa de datos se uso **MySQL**, en el frontend **Angular** cada unas de estás capas estan separadas por contenedores en **Docker**. Para la parte de seguridad de APIs se uso **JWT** y entre otras dependencias de PHP.

## Sistema de Reservación de Hoteles

Este sistema web permite a los clientes reservar habitaciones en un hotel. Las reservaciones se cobran por noche, contando desde el día de la reservación hasta las 12 PM del día siguiente.

# características

## Roles y Permisos:

### 1. Administrador
- Puede modificar, agregar, eliminar, actualizar y acceder a cualquier recurso y funcionalidad del sistema.
- Tiene acceso completo a todas las funcionalidades y datos del sistema.

### 2. Recepcionista
- Puede modificar, agregar, eliminar, actualizar y acceder a los recursos de habitaciones y reservaciones.
- Puede realizar reservaciones en nombre de los clientes.
- Gestiona las reservas y la disponibilidad de las habitaciones.

### 3. Cliente
- Puede realizar reservaciones de habitaciones.
- Puede cancelar sus propias reservaciones.
- Solo puede ver las reservaciones que ha hecho él mismo.


# Aplicación
### Login
![Texto alternativo](https://github.com/AlbinJunLiang/reservacion-hotel/blob/main/img/login.png?raw=true
)

### Home
![Texto alternativo](https://github.com/AlbinJunLiang/reservacion-hotel/blob/main/img/home.png?raw=true
)

### Gestion
![Texto alternativo](https://github.com/AlbinJunLiang/reservacion-hotel/blob/main/img/gestion.png?raw=true
)


# Implementacion
1. Tener Docker-Desktop, PHP, Node Js, Angular, Composer, Slim FrameWork y etc.
2. Descargar el proyecto y descomprimirlo.
3. Descomprimir la carpeta de presentación y que este al mismo nivel que la carpeta datos y negocios.
4. Abrir la consola o CMD y dirigir la ubicacion de presentacion, ahí debe ejecutar el comando npm install.
5. Abrir la carpeta datos y realizar el composer install, puede que sea necesario hacerlo en la carpeta negocios.
6. Ejecutar el comando **docker-compose up --build -d** en la ubicación de la carpeta datos.
7. Probar la aplicación en **localhost:80**, en caso de que no funcione ir a la carpeta presentación y ejecutar **ng s -p**.
8. El administrador o superusuario del sistema es **55** con contraseña **55**.






