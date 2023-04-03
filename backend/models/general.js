const baseDeDatos = require('../utils/baseDeDatos');

class General
{
    constructor(){
        
    }

    static Login(email, password)
    {
        return baseDeDatos.execute('SELECT * FROM usuario WHERE email = ? AND password = ?',
        [email, password]);
    }

    static PutPerfil(idUsuario, password, nombre, ap_paterno, ap_materno, telefono, foto)
    {
        return baseDeDatos.execute('UPDATE usuario SET nombre = ?, ap_paterno = ?, ap_materno = ?, password = ?, telefono = ?, foto = ? WHERE idUsuario = ?', [nombre, ap_paterno, ap_materno, password, telefono, foto, idUsuario])
    }

    static PutCita(idCita, estado) {
        return baseDeDatos.execute('UPDATE cita SET estado = ? WHERE idCita = ?', [estado, idCita])
    }

}

module.exports = General;