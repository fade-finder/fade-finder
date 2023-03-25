const baseDeDatos = require('../utils/baseDeDatos');

class General
{
    constructor(){
        
    }

    static Login(email, password)
    {
        return baseDeDatos.execute('SELECT * FROM usuario WHERE email=? AND password=?',
        [email, password]);
    }

}

module.exports = General;