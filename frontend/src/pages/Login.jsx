import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Input from '../components/Input'
// Hooks
import { useState } from 'react'
// Paquetes
import axios from 'axios'
import Swal from 'sweetalert2'
// Utils
import { validarEmail } from '../utils/validarEmail'

const Login = () => {
	// Const
	const navigate = useNavigate()

	// useState
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const onClickLogin = async e => {
		e.preventDefault()
		if (!validarCampos()) return false
		if(!validarEmail(email)) return false
		try {
			const res = await axios.post('http://localhost:3000/login', {
				email,
				password,
			})
			if (res.data != '') {
				// Si existe el usuario
				// Cargar datos al estado global
				const { isConfirmed } = await Swal.fire(
					'Sesión iniciada',
					'Iniciaste sesión correctamente',
					'success'
				)
				if (isConfirmed) {
					navigate('/dashboard/')
				}
			} else {
				// No existe el usuario
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
					<div className='w-[200px]'>
						<img src={Logo} alt='Logo' />
					</div>
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
