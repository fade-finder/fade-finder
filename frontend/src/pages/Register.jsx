import { Link, useNavigate } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Input from '../components/Input'

// Hooks
import { useState } from 'react'
// Extra
import axios from 'axios'
import Swal from 'sweetalert2'

const Register = () => {
	const navigate = useNavigate()

	const [cliente, setCliente] = useState({
		email: '',
		password: '',
		nombre: '',
		ap_paterno: '',
		ap_materno: '',
		telefono: '',
		foto: '',
	})

	// Funciones
	const changeStateValue = (name, value) => {
		setCliente({
			...cliente,
			[name]: value,
		})
	}

	const onClickRegister = async e => {
		e.preventDefault()
		try {
			await axios.post('http://localhost:3000/cliente/register', cliente)
			// Lo redireccionamo al login
			Swal.fire({
				icon: 'success',
				title: 'Cuenta creada',
				text: 'La cuenta se creo correctamente, iniciar sesión para continuar.',
				showConfirmButton: false,
				timer: 2500,
			})
			setTimeout(() => {
				navigate('/login')
			}, 2500)
		} catch (error) {
			Swal.fire('Error', error, 'error')
		}
	}

	const validarCampos = () => {
		if(email != '' && password != '' && nombre != '' && ap_paterno != '' && telefono != '') return true
		return false
	}

	return (
		<div className='bg-[#F5F8FE] w-full min-h-[100vh] flex justify-center items-center select-none py-16'>
			<div className='w-[600px] h-auto bg-white py-[50px] px-[60px] shadow-lg'>
				<div className='w-full flex justify-center mb-3'>
					<div className='w-[200px]'>
						<img src={Logo} alt='Logo' />
					</div>
				</div>
				<h1 className='text-lg font-bold mb-5'>Registar cuenta</h1>
				<form action='' className='flex flex-col gap-y-3'>
					<div className='mb-4'>
						<div className='flex items-center gap-x-3'>
							{/* Email */}
							<Input
								label='Correo electrónico'
								type='email'
								name='email'
								id='email'
								placeholder='ejemplo@dominio'
								value={cliente.email}
								onChange={e => changeStateValue(e.target.id, e.target.value)}
							/>

							{/* Pasword */}
							<Input
								label='Contraseña'
								type='text'
								name='password'
								id='password'
								placeholder='*****'
								value={cliente.password}
								onChange={e => changeStateValue(e.target.id, e.target.value)}
							/>
						</div>
					</div>
					<Input
						label='Nombre(s)'
						type='text'
						name='nombre'
						id='nombre'
						placeholder='Escribe tu nombre'
						value={cliente.nombre}
						onChange={e => changeStateValue(e.target.id, e.target.value)}
					/>
					<div className='flex items-center gap-x-3'>
						<Input
							label='Apellido paterno'
							type='text'
							name='ap_paterno'
							id='ap_paterno'
							placeholder='Escribe tu apellido paterno'
							value={cliente.ap_paterno}
							onChange={e => changeStateValue(e.target.id, e.target.value)}
						/>
						<Input
							label='Apellido materno'
							type='text'
							name='ap_materno'
							id='ap_materno'
							placeholder='Escribe tu apellido materno'
							value={cliente.ap_materno}
							onChange={e => changeStateValue(e.target.id, e.target.value)}
						/>
					</div>
					<div className='flex items-center gap-x-3'>
						<Input
							label='Teléfono'
							type='text'
							name='telefono'
							id='telefono'
							placeholder='Escribe tu teléfono'
							value={cliente.telefono}
							onChange={e => changeStateValue(e.target.id, e.target.value)}
						/>
						<Input
							label='Foto de perfil'
							type='file'
							name='foto'
							id='foto'
							placeholder='Selecciona una foto'
							value={cliente.foto}
							onChange={e => changeStateValue(e.target.id, e.target.value)}
						/>
					</div>
					<div className='mt-6'>
						<button
							type='submit'
							onClick={e => onClickRegister(e)}
							className='w-full py-3 rounded-full bg-[var(--colorPrimario)] text-base font-semibold text-white hover:opacity-80 duration-200 cursor-pointer shadow-lg mb-3'
						>
							Registrarse
						</button>
						<p className='text-xs font-base'>
							¿Ya tienes una cuenta?
							<Link
								to='/login'
								className='font-semibold text-[var(--colorPrimario)] hover:opacity-80 duration-200'
							>
								{' '}
								Inciar sesión
							</Link>
						</p>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Register
