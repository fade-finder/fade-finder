/* Se crea la base de datos */
Create database FadeFinder;
use FadeFinder;

/* Se crean las tablas */
create table cliente(
	idCliente int not null unique auto_increment primary key,
    nombre varchar(45),
    ap_paterno varchar(45),
    ap_materno varchar(45),
    fecha_nacimiento date,
    telefono varchar(10),
	correo varchar(45),
    password varchar(45),
    direccion varchar(45),
    foto varchar(100)
);

create table barbero(
	idBarbero int not null unique auto_increment primary key,
    nombre varchar(45),
    ap_paterno varchar(45),
    ap_materno varchar(45),
    correo varchar(45),
    password varchar(45),
    genero char(1),
    telefono varchar(10),
    foto varchar(100),
    direccion varchar(45),
    fecha_nacimiento date,
    estado int(1)
);

create table servicio(
	idServicio int not null unique auto_increment primary key,
    nombre varchar(45),
    precio float,
    descripcion varchar(50),
    duracion int,
    disponibilidad int(1),
    imagen varchar(100)
);

create table cita(
	idCita int not null auto_increment primary key,
    estado int(1),
    fecha_creacion date,
    horario datetime,
    duracion int,
    total_pagar float,
    idBarbero int,
    idCliente int,
    foreign key (idBarbero) references barbero (idBarbero),
    foreign key (idCliente) references cliente (idCliente)
);

create table horario(
	idHorario int not null auto_increment primary key,
    dia varchar(45),
    hora_inicio time,
    hora_fin time,
    idBarbero int,
    foreign key (idBarbero) references barbero (idBarbero)
);

create table admin(
	idAdmin int not null unique auto_increment primary key,
    nombre varchar(45),
    ap_paterno varchar(45),
    ap_materno varchar(45),
    correo varchar(45),
    password varchar(45),
    genero char(1),
    telefono varchar(10),
    foto varchar(100),
    direccion varchar(45),
    fecha_nacimiento date
);

create table cita_servicio(
	idCita int not null,
    idServicio int not null,
    foreign key (idCita) references cita (idCita),
    foreign key (idServicio) references servicio (idServicio),
    primary key (idCita,idServicio)
);

select * from barbero;
