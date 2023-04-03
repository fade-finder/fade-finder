DROP DATABASE IF EXISTS fadefinder;
Create database FadeFinder;
use FadeFinder;

create table rol(
	idRol int not null unique primary key,
    nombre varchar(30) not null
);

create table usuario(
	idUsuario int not null unique auto_increment primary key,
    nombre varchar(45) not null,
    ap_paterno varchar(45) not null,
    ap_materno varchar(45),
    email varchar(45) unique,
    password varchar(256) not null,
    telefono varchar(10) not null,
    foto varchar(100),
    estado int(1) not null,
    idRol int not null,
    foreign key (idRol) references rol (idRol)
);

create table dia(
	idDia int not null auto_increment primary key,
    dia varchar(45) not null
);

create table horario(
	idHorario int not null auto_increment primary key,
    hora_inicio time not null,
    hora_fin time not null,
    idBarbero int not null,
    idDia int not null,
    foreign key (idBarbero) references usuario (idUsuario),
    foreign key (idDia) references dia (idDia)
);

create table servicio(
	idServicio int not null unique auto_increment primary key,
    nombre varchar(45) not null,
    precio float not null,
    duracion int not null,
    imagen varchar(200)
);

create table cita(
	idCita int not null auto_increment primary key,
    estado int(1) not null,
    fecha_creacion date not null,
    fecha date not null,
    hora time not null,
    duracion int not null,
    total_pagar float not null,
    idCliente int not null,
    idBarbero int not null,
    foreign key (idCliente) references usuario (idUsuario),
    foreign key (idBarbero) references usuario (idUsuario)
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

-- Insertamos en Usuarios 
-- Admin
insert into usuario values (null, 'Enrique', 'Camarena', 'Garcia', 'admin@gmail.com', '12345', '1234567890', 'https://media.gq.com.mx/photos/5bfdcc8f4958a1bc759a27bd/3:2/w_1011,h_674,c_limit/bob%20esponja.jpg', 1, 3);
-- Barbero
insert into usuario values (null, 'Bryan', 'Sanchez', 'Lopez', 'bryan@gmail.com', '12345', '1234567890', 'https://media.gq.com.mx/photos/5bfdcc8f4958a1bc759a27bd/3:2/w_1011,h_674,c_limit/bob%20esponja.jpg', 1, 2); 
-- Cliente
insert into usuario values (null, 'Daniel Ramón', 'Solis', 'Medina', 'daniel@gmail.com', '140503', '4291002030', 'https://media.revistagq.com/photos/5f3243ee64de88802df64b6a/master/pass/patricio.jpg', 1, 1);

-- Insertamos en dias
insert into dia (idDia, dia) values (1, 'Lunes');
insert into dia (idDia, dia) values (2, 'Martes');
insert into dia (idDia, dia) values (3, 'Miercoles');
insert into dia (idDia, dia) values (4, 'Jueves');
insert into dia (idDia, dia) values (5, 'Viernes');
insert into dia (idDia, dia) values (6, 'Sabado');
insert into dia (idDia, dia) values (7, 'Domingo');

-- Insertamos horarios
-- insert into horario (idHorario, hora_inicio, hora_fin, idBarbero, idDia) values (1, '08:00:00', '16:00:00', 2, 1);	-- lunes
insert into horario (idHorario, hora_inicio, hora_fin, idBarbero, idDia) values (2, '10:30:00', '17:00:00', 2, 2);	-- martes
insert into horario (idHorario, hora_inicio, hora_fin, idBarbero, idDia) values (3, '07:00:00', '14:00:00', 2, 6);	-- lunes
insert into horario (idHorario, hora_inicio, hora_fin, idBarbero, idDia) values (4, '17:00:00', '20:00:00', 2, 6);	

-- Insertamos citas
insert into cita (idCita, estado, fecha_creacion, fecha, hora, duracion, total_pagar, idCliente, idBarbero) values (1, 0, '2023-03-28', '2023-04-01', '17:30:00', 10, 250.0, 3, 2);

-- insrtamos servicios
insert into servicio (idServicio, nombre, precio, duracion, imagen) values (1, 'Corte escolar', 75, 40, 'https://ciudadtrendy.mx/wp-content/uploads/2022/04/Corte-de-cabello-de-nino-Ciudad-Trendy-2.jpg');
insert into servicio (idServicio, nombre, precio, duracion, imagen) values (2, 'Taper Fade', 120, 60, 'https://www.menshairstyletrends.com/wp-content/uploads/2020/02/taper-fade-handsome_ransom-819x1024.jpg');
insert into servicio (idServicio, nombre, precio, duracion, imagen) values (3, 'Corte de barba', 50, 25, 'https://i.pinimg.com/550x/95/6e/07/956e0727f79320a084d10c965be226c6.jpg');
insert into servicio (idServicio, nombre, precio, duracion, imagen) values (4, 'Low Fade en V', 150, 80, 'https://i.pinimg.com/originals/b9/96/54/b996547888f26678b603c1e60e2716a1.jpg');

-- insertamos cita_servicio 
insert into cita_servicio (idCita, idServicio) values (1, 2); 

select * from usuario;
select * from rol;
select * from dia;
select * from horario;
select * from cita;
select * from servicio;

select * from cita_servicio;


