const baseDeDatos = require('../utils/baseDeDatos');

class Barbero
{
    constructor(idBarbero, nombre, ap_paterno, ap_materno, correo, password, genero, telefono, foto, direccion, fecha_nacimiento, estado){
        this.idBarbero = idBarbero
        this.nombre = nombre
        this.ap_paterno = ap_paterno
        this.ap_materno = ap_materno
        this.correo = correo
        this.password = password
        this.genero = genero
        this.telefono = telefono
        this.foto = foto
        this.direccion = direccion
        this.fecha_nacimiento = fecha_nacimiento
        this.estado = estado
    }

    AgregarBarbero()
    {
        return baseDeDatos.execute('INSERT INTO barbero ()')
    }
}


module.exports = Barbero;

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