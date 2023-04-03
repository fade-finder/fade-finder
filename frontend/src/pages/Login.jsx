import Logo from '../assets/logo.png'
import Input from '../components/Input'
// Hooks
import { useState } from 'react'
// Modulos
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
// Utils
import { validarEmail } from '../utils/validaciones'
// Redux
import { useDispatch } from 'react-redux'
import { SET_USUARIO, SET_CITAS, SET_CITAS_CLIENTES } from '../redux/usuarioSlice'

const Login = () => {
	// Const
	const navigate = useNavigate()
	const dispatch = useDispatch()

	// useState
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const onClickLogin = async e => {
		e.preventDefault()
		if (!validarCampos()) return false
		if (!validarEmail(email)) return false
		try {
			setEmail(email.toLowerCase().trim())
			setPassword(password.trim())
			let res = await axios.post('http://localhost:3000/login', {
				email,
				password,
			})
			if (res.data != '') {
				const { isConfirmed } = await Swal.fire(
					'Sesión iniciada',
					'Iniciaste sesión correctamente',
					'success'
				)
				if (isConfirmed) {
					// * * * * * * * * * *
					localStorage.setItem('idToken', res.data.idUsuario) //almacenamos el token
					dispatch(SET_USUARIO(res.data))
					if (res.data.idRol == 1) {
						res = await axios.get(
							'http://localhost:3000/cliente/citas/' + res.data.idUsuario
						)
						dispatch(SET_CITAS(res.data)) // actualizamos las citas del usuario
					} else if (res.data.idRol == 3) {
						const res = await axios.get('http://localhost:3000/citas')
						dispatch(SET_CITAS_CLIENTES(res.data)) // actualizamos las citas de los clientes
					}
				}
			} else {
				Swal.fire(
					'Error',
					'Las credenciales ingresadas son incorrectas',
					'error'
				)
			}
		} catch (error) {
			Swal.fire('Error', error.name + ': ' + error.message, 'error')
		}
	}

	const validarCampos = () => {
		if (email != '' && password != '') return true
		Swal.fire(
			'Campos vacios',
			'No puedes dejar campos vacíos, intentalo de nuevo',
			'warning'
		)
		return false
	}

	return (
		<div className='bg-[#F5F8FE] w-full min-h-[100vh] flex justify-center items-center select-none py-16'>
			<div className='w-[600px] h-auto bg-white py-[50px] px-[100px] shadow-lg'>
				<div className='w-full flex justify-center mb-3'>
					<Link to='/'>
						<div className='w-[200px]'>
							<img src={Logo} alt='Logo' />
						</div>
					</Link>
				</div>
				<h1 className='text-lg font-bold mb-5'>Login</h1>
				<form action='' className='flex flex-col gap-y-5'>
					{/* Email */}
					<Input
						label='Correo electrónico'
						type='email'
						name='correo'
						id='correo'
						placeholder='ejemplo@dominio'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>

					{/* Pasword */}
					<Input
						label='Contraseña'
						type='password'
						name='password'
						id='password'
						placeholder='*****'
						value={password}
						onChange={e => setPassword(e.target.value)}
					/>
					<div className='mt-2'>
						<button
							type='submit'
							onClick={e => onClickLogin(e)}
							className='w-full py-3 rounded-full bg-[var(--colorPrimario)] text-base font-semibold text-white hover:opacity-80 duration-200 cursor-pointer shadow-lg mb-3'
						>
							Login
						</button>
						<p className='text-xs font-base'>
							¿No tienes cuenta?
							<Link
								to='/cliente/register'
								className='font-semibold text-[var(--colorPrimario)] hover:opacity-80 duration-200'
							>
								{' '}
								Crear cuenta
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Login
