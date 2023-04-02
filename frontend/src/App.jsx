// Modulos
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUsuario } from './redux/usuarioSlice'
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
		dispatch(setUsuario(res.data)) // Actualizamos el estado del usuario
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
