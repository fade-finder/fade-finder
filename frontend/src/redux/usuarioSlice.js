import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	idUsuario: null,
	email: null,
	password: null,
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
				password,
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
			state.password = password
			state.nombre = nombre
			state.ap_paterno = ap_paterno
			state.ap_materno = ap_materno
			state.telefono = telefono
			state.foto = foto
			state.estado = estado
			state.idRol = idRol
		},
		CLEAN_USUARIO: state => {
			state.idUsuario = null
			state.email = null
			state.password = null
			state.nombre = null
			state.ap_paterno = null
			state.ap_materno = null
			state.telefono = null
			state.foto = null
			state.estado = null
			state.idRol = null
		},
		SET_CITAS: (state, action) => {
			const { citas } = action.payload
			state.citas = citas
		},
		UPDATE_CITA: (state, action) => {
			const [idCita, updates] = action.payload
			state.citas = state.citas.map(cita => {
				if (cita.idCita == idCita) {
					return {
						...cita,
						...updates
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
} = usuarioSlice.actions
export default usuarioSlice.reducer
