import { Link } from 'react-router-dom'
import Logo from '../assets/logo.png'
import Input from '../components/Input'

const Login = () => {
	return (
		<div className='bg-[#F5F8FE] w-full min-h-[100vh] flex justify-center items-center select-none'>
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
					/>

					{/* Pasword */}
					<Input
						label='Contraseña'
						type='password'
						name='password'
						id='password'
						placeholder='*****'
					/>

					<div>
						<button
							type='submit'
							className='w-full py-3 rounded-full bg-[var(--colorPrimario)] text-base font-semibold text-white hover:opacity-80 duration-200 cursor-pointer shadow-lg mb-3'
						>
							Login
						</button>
						<p className='text-xs font-base'>
							¿No tienes cuenta?
							<Link
								to='/'
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
