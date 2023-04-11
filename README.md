# FadeFinder
Aplicación web para la gestión y administración de citas en una barberia.

## Roles
- Administrador
- Barbero
- Cliente

## Funcionalidades
### Administrador
1. CRUD con barberos
2. Ver clientes
3. Ver y cancelar citas
4. Ver datos generales de las citas (citas completadas, citas confirmadas, citas por confirmar, citas canceladas)
5. Ver datos del negocio (ingresos, promedio de ingresos por cita, servicios completados)
### Barbero
1. Ver clientes
2. Administrar sus citas propias
3. Ver datos generales de las citas (citas completadas, citas confirmadas, citas por confirmar, citas canceladas)
### Cliente
1. Registrarse
2. Inciar sesión
3. Reservar cita
4. Administrar citas
### General
1. Administrar datos de su cuenta


## Instalación
1. Clonar repositorio
### Carpeta backend
2. Ejecutar comando `npm i` en la raía de la carpeta backend
2. Dentro de la carpeta llamada backend crear un archivo llamado .env y agregar lo siguiente:
```
DB_PASSWORD=CONTRASEÑA_DE_MYSQL_WORKBENCH
MULTIAVATAR_API_KEY=9vCQPGoJqVYelt
```

## Carpeta frontend
3. Ejecutar el comando `npm i` en la raíz de la carpeta frontend

## Uso
- Iniciar el servidor backend ejecutando `npm run dev` estando en la carpeta /backend
- Iniciar el servidor de desarrollo ejecutando `npm run dev` estando en la carpeta /frontend
