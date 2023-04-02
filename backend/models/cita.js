const baseDeDatos = require("../utils/baseDeDatos");
const { format } = require("date-fns");

const fechaActual = new Date();
const fechaFormateada = format(fechaActual, "yyyy-MM-dd");

class Cita {
  constructor(
    fecha,
    hora,
    duracion,
    total_pagar,
    idCliente,
    idBarbero,
    servicios
  ) {
    this.fecha_creacion = fechaFormateada;
    this.fecha = fecha;
    this.hora = hora;
    this.duracion = duracion;
    this.total_pagar = total_pagar;
    this.idCliente = idCliente;
    this.idBarbero = idBarbero;
    this.servicios = servicios;
  }

  PostCita() {
    return baseDeDatos.execute(
      "INSERT INTO cita (idCita, estado, fecha_creacion, fecha, hora, duracion, total_pagar, idCliente, idBarbero) VALUES (?,?,?,?,?,?,?,?,?)",
      [
        null,
        0,
        this.fecha_creacion,
        this.fecha,
        this.hora,
        this.duracion,
        this.total_pagar,
        this.idCliente,
        this.idBarbero,
      ]
    );
  }

  static PostCitaServicio(idCita, idServicio) {
    return baseDeDatos.execute(
      "INSERT INTO cita_servicio (idCita, idServicio) VALUES (?,?)",
      [idCita, idServicio]
    );
  }
}

module.exports = Cita;
