import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	idUsuario: null,
	email: null,
	nombre: null,
	ap_paterno: null,
	ap_materno: null,
	telefono: null,
	foto: null,
	estado: null,
	idRol: null,
	citas: null,
}

export const usuarioSlice = createSlice({
	name: 'usuario',
	initialState,
	reducers: {
		SET_USUARIO: (state, action) => {
			const {
				idUsuario,
				email,
				nombre,
				ap_paterno,
				ap_materno,
				telefono,
				foto,
				estado,
				idRol,
			} = action.payload
			state.idUsuario = idUsuario
			state.email = email
			state.nombre = nombre
			state.ap_paterno = ap_paterno
			state.ap_materno = ap_materno
			state.telefono = telefono
			state.foto = foto
			state.estado = estado
			state.idRol = idRol
		},
		UPDATE_USUARIO: (state, action) => {
			const usuario = action.payload
			return {
				...state,
				...usuario
			}
		},
		CLEAN_USUARIO: state => {
			state.idUsuario = null
			state.email = null
			state.nombre = null
			state.ap_paterno = null
			state.ap_materno = null
			state.telefono = null
			state.foto = null
			state.estado = null
			state.idRol = null
		},
		SET_CITAS: (state, action) => {
			const citas = action.payload

			const listaCitas = citas
			// cargamos los servicios de cada cita en un arreglo
			const citasUnidas = listaCitas.reduce((acumulador, citaActual) => {
				// Buscamos si la cita ya existe en el acumulador
				const citaExistente = acumulador.find(
					cita => cita.idCita === citaActual.idCita
				)
				if (!citaExistente) {
					// Si la cita no existe en el acumulador, creamos un nuevo objeto
					// con la información de la cita y un arreglo con el primer servicio
					const nuevaCita = {
						idCita: citaActual.idCita,
						estado: citaActual.estado,
						fecha_creacion: citaActual.fecha_creacion,
						fecha: citaActual.fecha,
						hora: citaActual.hora,
						duracion: citaActual.duracionCita,
						total_pagar: citaActual.total_pagar,
						idCliente: citaActual.idCliente,
						idBarbero: citaActual.idBarbero,
						nombreBarbero: citaActual.nombreBarbero,
						ap_paternoBarbero: citaActual.ap_paternoBarbero,
						servicios: [
							{
								idServicio: citaActual.idServicio,
								nombre: citaActual.nombre,
								precio: citaActual.precio,
								duracion: citaActual.duracionServicio,
								imagen: citaActual.imagen,
							},
						],
					}

					// Agregamos el nuevo objeto al acumulador
					return [...acumulador, nuevaCita]
				} else {
					// Si la cita ya existe en el acumulador, agregamos el nuevo servicio
					citaExistente.servicios.push({
						idServicio: citaActual.idServicio,
						nombre: citaActual.nombre,
						precio: citaActual.precio,
						imagen: citaActual.imagen,
					})

					// Retornamos el acumulador sin agregar un nuevo objeto
					return acumulador
				}
			}, [])
			state.citas = citasUnidas
		},
		UPDATE_CITA: (state, action) => {
			const [idCita, updates] = action.payload
			state.citas = state.citas.map(cita => {
				if (cita.idCita == idCita) {
					return {
						...cita,
						...updates,
					}
				} else {
					return cita
				}
			})
		},
		CLEAN_CITAS: state => {
			state.citas = null
		},
	},
})

export const {
	SET_USUARIO,
	CLEAN_USUARIO,
	SET_CITAS,
	UPDATE_CITA,
	CLEAN_CITAS,
	UPDATE_USUARIO
} = usuarioSlice.actions
export default usuarioSlice.reducer
