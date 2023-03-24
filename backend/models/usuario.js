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

    static BorrarBarbero(id)
    {
        return baseDeDatos.execute('DELETE FROM usuario WHERE idUsuario = ?',[id])
    }

    ActualizarBarbero(id)
    {
        return baseDeDatos.execute('UPDATE usuario SET nombre=?, ap_paterno=?, ap_materno=?, email=?, password=?, telefono=?, foto=? WHERE idUsuario = ?', 
        [this.nombre, this.ap_paterno, this.ap_materno, this.email, this.password, this.telefono, this.foto, id])
    }
}


module.exports = Usuario;

// exports.postAgregarBarbero = (req, res, next) => {
//     console.log('Aqui va la lógica para agregar un barbero');
//     res.json({status: true})
  
//     // retorna al cliente lo siguiente si el barbero se agrego correctamente a la bd
//     // res.json({status: true})
//     // retorna al cliente lo siguiente si ocurre un error
//     // res.json({status: false})
//   }
//   exports.putBarbero = (req, res) => {
//     console.log('Aqui va la lógica para actualizar un barbero');
//     console.log(req.params.id)   // con esta linea obtengo el id del barbero que debo modificar de la base de datos
//     console.log(req.body)    // Todos los datos que el admin ingreso al formulario para editar al barbero estan en req.body, solo debes crear la interaccion con la bd para modificarlo
  
//     res.json({status: true})
//     // retorna al cliente lo siguiente si se modifica el barbero
//     // res.json({status: true})
//     // retorna al cliente lo siguiente si ocurre un error
//     // res.json({status: false})
//   }
//   exports.deleteBarbero = (req, res) => {
//     console.log(req.params.id)    // con esta linea obtengo el id del barbero que debo eliminar de la base de datos
//     res.json({status: true})
//     // retorna al cliente lo siguiente si se elimina al barbero
//     // res.json({status: true})
//     // retorna al cliente lo siguiente si ocurre un error
//     // res.json({status: false})
//   }