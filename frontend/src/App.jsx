// Modulos
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SET_USUARIO, SET_CITAS } from './redux/usuarioSlice'
import axios from 'axios'

// Imagen
import Cargando from './assets/cargando.svg'

// Pages
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import NoPage from './pages/NoPage'
import Perfil from './pages/Perfil'
import LayoutDashboard from './components/LayoutDashboard'
import Barberos from './pages/Barberos'
import Clientes from './pages/Clientes'
import Citas from './pages/Citas'
import Negocio from './pages/Negocio'
import Resenas from './pages/Resenas'
import Cliente from './pages/Cliente'

function App() {
	const dispatch = useDispatch() // se usa para ejecutar una accion con mi estado (actualizarlo)
	const usuarioSlice = useSelector(state => state.usuario) // obtengo el estado
	const [isLoading, setIsLoading] = useState(true) // me indica si debo mostrar el spinner

	useEffect(() => {
		const idToken = localStorage.getItem('idToken') //obtengo la variable local idToken que contiene la idUsuario
		getDatosUsuario(idToken) // ejecutamos funcion para cargar los datos del usuario

		setTimeout(() => {
			setIsLoading(false)
		}, 500)
	}, [])

	const getDatosUsuario = async idToken => {
		const res = await axios.get('http://localhost:3000/datos/' + idToken) // cargamos datos del backend con ayuda del id
		dispatch(SET_USUARIO(res.data)) // Actualizamos el estado del usuario

		// En caso de ser cliente, buscaremos sus citas
		if (res.data.idRol == 1) {
			getCitasCliente(res.data.idUsuario)
		}
	}

	const getCitasCliente = async (id) => {
		const res = await axios.get(
			'http://localhost:3000/cliente/citas/' + id
		)
	
		const listaCitas = res.data

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
					duracion: citaActual.duracion,
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
		dispatch(SET_CITAS({citas: citasUnidas})) // actualizamos las citas del usuario
	}

	if (isLoading) {
		return (
			<div className='bg-white absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center'>
				<div className='w-[60px] h-[60px] '>
					<img src={Cargando} alt='Spinner' />
				</div>
			</div>
		)
	}

	return (
		<BrowserRouter>
			<Routes>
				{/* plantilla header y footer */}
				<Route path='/' element={<Layout />}>
					<Route index element={<LandingPage />} />
					<Route path='*' element={<NoPage />} />
				</Route>

				{/* Plantilla en blanco */}
				<Route
					path='/citas'
					element={
						usuarioSlice.idUsuario != null ? (
							usuarioSlice.idRol == 1 ? (
								<Cliente />
							) : (
								<Navigate to='/dashboard' />
							)
						) : (
							<Navigate to='/login' />
						)
					}
				/>
				<Route
					path='/login'
					element={
						usuarioSlice.idUsuario != null ? (
							<Navigate to='/dashboard' />
						) : (
							<Login />
						)
					}
				/>
				<Route
					path='/cliente/register'
					element={
						usuarioSlice.idUsuario != null ? (
							<Navigate to='/dashboard' />
						) : (
							<Register />
						)
					}
				/>
				<Route
					path='/perfil'
					element={
						usuarioSlice.idUsuario != null ? (
							<Perfil />
						) : (
							<Navigate to='/login' />
						)
					}
				/>

				{/* Plantilla con dashboard */}
				<Route
					path='/dashboard'
					element={
						usuarioSlice.idUsuario != null ? (
							usuarioSlice.idRol != 1 ? (
								<LayoutDashboard />
							) : (
								<Navigate to='/citas' />
							)
						) : (
							<Navigate to='/login' />
						)
					}
				>
					<Route
						index
						element={
							usuarioSlice.idRol == 1 ? (
								<Navigate to='/cliente' />
							) : usuarioSlice.idRol == 2 ? (
								<Navigate to='/dashboard/citas' />
							) : (
								<Negocio />
							)
						}
					/>
					<Route
						path='negocio'
						element={
							usuarioSlice.idRol == 1 ? (
								<Navigate to='/cliente' />
							) : usuarioSlice.idRol == 2 ? (
								<Navigate to='/dashboard/citas' />
							) : (
								<Negocio />
							)
						}
					/>
					<Route
						path='citas'
						element={
							usuarioSlice.idRol == 1 ? (
								<Navigate to='/cliente' />
							) : (
								usuarioSlice.idRol >= 2 && <Citas />
							)
						}
					/>
					<Route
						path='clientes'
						element={
							usuarioSlice.idRol == 1 ? (
								<Navigate to='/cliente' />
							) : (
								usuarioSlice.idRol >= 2 && <Clientes />
							)
						}
					/>
					<Route
						path='barberos'
						element={
							usuarioSlice.idRol == 1 ? (
								<Navigate to='/cliente' />
							) : usuarioSlice.idRol == 2 ? (
								<Navigate to='/dashboard/citas' />
							) : (
								<Barberos />
							)
						}
					/>
					<Route path='resenas' element={<Resenas />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
