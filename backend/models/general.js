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

    static PutCita(idCita) {
        return baseDeDatos.execute('UPDATE cita SET estado = 3 WHERE idCita = ?', [idCita])
    }

}

module.exports = General;