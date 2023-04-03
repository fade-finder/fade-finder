const baseDeDatos = require('../utils/baseDeDatos');

class Usuario
{
    constructor(nombre, ap_paterno, ap_materno, email, password, telefono, foto){
        this.nombre = nombre
        this.ap_paterno = ap_paterno
        this.ap_materno = ap_materno
        this.email = email
        this.password = password
        this.telefono = telefono
        this.foto = foto
    }

    AgregarBarbero(id)
    {
        return baseDeDatos.execute('INSERT INTO usuario (idUsuario, nombre, ap_paterno, ap_materno, email, password, telefono, foto, estado, idRol) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [null, this.nombre, this.ap_paterno, this.ap_materno, this.email, this.password, this.telefono, this.foto, 1, 2])
    }

    static VerBarberos()
    {
        return baseDeDatos.execute('SELECT * FROM usuario where idRol = 2')
    }

    static VerCitas(id)
    {
        return baseDeDatos.execute('SELECT cita.*, cita.duracion AS duracionCita, usuario.nombre AS nombreBarbero, usuario.ap_paterno AS ap_paternoBarbero, servicio.*, servicio.duracion AS duracionServicio FROM cita JOIN usuario ON cita.idBarbero = usuario.idUsuario JOIN cita_servicio ON cita.idCita = cita_servicio.idCita JOIN servicio ON cita_servicio.idServicio = servicio.idServicio WHERE cita.idCliente = ?', [id])
    }

    static getServicios()
    {
        return baseDeDatos.execute('SELECT * FROM servicio')
    }

    static BorrarBarbero(id)
    {
        return baseDeDatos.execute('DELETE FROM usuario WHERE idUsuario = ?',[id])
    }

    ActualizarBarbero(id)
    {
        return baseDeDatos.execute('UPDATE usuario SET nombre=?, ap_paterno=?, ap_materno=?, email=?, password=?, telefono=?, foto=? WHERE idUsuario = ?', 
        [this.nombre, this.ap_paterno, this.ap_materno, this.email, this.password, this.telefono, this.foto, id])
    }

    static VerClientes()
    {
        return baseDeDatos.execute('SELECT * FROM usuario where idRol = 1')
    }

    static GetDatos(id)
    {
        return baseDeDatos.execute('SELECT * FROM usuario where idUsuario = ?', [id])
    }
    static GetHorario(idBarbero, idDia)
    {
        return baseDeDatos.execute('SELECT * from horario where idBarbero = ? AND idDia = ?', [idBarbero, idDia])
    }

    static getCitas(idBarbero, fecha){
        return baseDeDatos.execute('SELECT * from cita where idBarbero = ? AND fecha = ? ORDER BY fecha ASC', [idBarbero, fecha])
    }

    AgregarCliente()
    {
        return baseDeDatos.execute('INSERT INTO usuario (idUsuario, nombre, ap_paterno, ap_materno, email, password, telefono, foto, estado, idRol) VALUES (?,?,?,?,?,?,?,?,?,?)',
        [null, this.nombre, this.ap_paterno, this.ap_materno, this.email, this.password, this.telefono, this.foto, 1, 1])
    }

    static BorrarPerfilCliente(id)
    {
        return baseDeDatos.execute('DELETE FROM usuario WHERE idUsuario = ? AND idRol = ?',[id, 1])
    }
}


module.exports = Usuario;
