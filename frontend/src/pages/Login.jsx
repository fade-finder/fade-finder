import { Link } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Input from '../components/Input'
import Select from '../components/Select'

// Hooks
import { useState } from 'react'
// Extra
import axios from 'axios'
import Swal from 'sweetalert2'

const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [rol, setRol] = useState("0")

	const onClickLogin = async e => {
		e.preventDefault()
		try {
			const res = await axios.post('http://localhost:3000/login', {
				email,
				password,
				rol
			})
			// Aqui guardaremos el usuario en nuestro estado global
			console.log(res.data)
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: error.message + ': ' + error.code,
			})
		}
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

					<div className='w-1/2'>
						<label htmlFor="rol" className='text-base font-semibold text-gray-600'>Rol</label>
						<Select
							id='rol'
							value={rol}
							onChange={e => setRol(e.target.value)}
							opciones={[
								{ value: 0, texto: 'Cliente' },
								{ value: 1, texto: 'Empleado' },
								{ value: 2, texto: 'Administrador' }
							]}
						/>
					</div>

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
