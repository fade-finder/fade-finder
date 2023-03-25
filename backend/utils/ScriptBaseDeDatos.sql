/* Se crea la base de datos */
DROP DATABASE IF EXISTS fadefinder;
Create database FadeFinder;
use FadeFinder;

/* Se crean las tablas */
create table rol(
	idRol int not null unique primary key,
    nombre varchar(30)
);

create table usuario(
	idUsuario int not null unique auto_increment primary key,
    nombre varchar(45),
    ap_paterno varchar(45),
    ap_materno varchar(45),
    email varchar(45) unique,
    password varchar(45),
    telefono varchar(10),
    foto varchar(100),
    estado int(1),
    idRol int,
    foreign key (idRol) references rol (idRol)
);

create table horario(
	idHorario int not null auto_increment primary key,
    dia varchar(45),
    hora_inicio time,
    hora_fin time,
    idUsuario int,
    foreign key (idUsuario) references usuario (idUsuario)
);

create table servicio(
	idServicio int not null unique auto_increment primary key,
    nombre varchar(45),
    precio float,
    descripcion varchar(200),
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
    idUsuario int,
    foreign key (idUsuario) references usuario (idUsuario)
);

create table cita_servicio(
	idCita int not null,
    idServicio int not null,
    foreign key (idCita) references cita (idCita),
    foreign key (idServicio) references servicio (idServicio),
    primary key (idCita,idServicio)
);

-- Insercion de roles
insert into rol (idRol, nombre) values (1, 'cliente');
insert into rol (idRol, nombre) values (2, 'barbero');
insert into rol (idRol, nombre) values (3, 'admin');

insert into usuario values (null, 'Kike', 'Camarena', 'Garcia', 'kike@gmail.com', '1234', '1234567890', 'https://media.gq.com.mx/photos/5bfdcc8f4958a1bc759a27bd/3:2/w_1011,h_674,c_limit/bob%20esponja.jpg', 1, 2);
insert into usuario values (null, 'Daniel Ramón', 'Solis', 'Medina', 'daniel@gmail.com', '140503', '4291002030', 'https://media.revistagq.com/photos/5f3243ee64de88802df64b6a/master/pass/patricio.jpg', 1, 1);

select * from usuario;
select * from rol;


