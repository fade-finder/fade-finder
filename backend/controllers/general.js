const Usuario = require("../models/usuario");
const General = require("../models/general");

exports.getBarberos = (req, res) => {
  const barberos = Usuario.VerBarberos()
    .then((barberos) => {
      res.send(barberos[0]);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getServicios = (req, res) => {
  Usuario.getServicios()
    .then((servicios) => {
      res.send(servicios[0]);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getClientes = (req, res) => {
  Usuario.VerClientes()
    .then((clientes) => {
      res.send(clientes[0]);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDatos = (req, res) => {
  Usuario.GetDatos(req.params.idToken)
    .then((resultado) => {
      res.send(resultado[0][0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getHorarioBarbero = (req, res) => {
  const idBarbero = req.params.idBarbero;
  const idDia = req.params.idDia;

  Usuario.GetHorario(idBarbero, idDia)
    .then((resultado) => {
      res.send(resultado[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.getCitas = (req, res) => {
  const idBarbero = req.params.idBarbero;
  const fecha = req.params.fecha;
  Usuario.getCitas(idBarbero, fecha)
    .then((resultado) => {
      res.send(resultado[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.postLogin = (req, res) => {
  General.Login(req.body.email, req.body.password)
    .then((usuario) => {
      res.send(usuario[0][0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.putPerfil = (req, res) => {
  const idUsuario = req.body.idUsuario;
  const password = req.body.password;
  const nombre = req.body.nombre;
  const ap_paterno = req.body.ap_paterno;
  const ap_materno = req.body.ap_materno;
  const telefono = req.body.telefono;
  const foto = req.body.foto;
  General.PutPerfil(
    idUsuario,
    password,
    nombre,
    ap_paterno,
    ap_materno,
    telefono,
    foto
  )
    .then((respuesta) => {
      res.send(respuesta[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.putCita = (req, res) => {
  General.PutCita(req.params.idCita, req.body.estado)
    .then((respuesta) => {
      res.send(respuesta[0]);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};
