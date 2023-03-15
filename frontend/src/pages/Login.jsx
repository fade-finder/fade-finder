import { Link } from 'react-router-dom'
import Logo from '../assets/logo.png'

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
				<form action='' className=''>
					{/* Email */}
					<div className='flex flex-col w-full gap-y-1 mb-5'>
						<label htmlFor='correo' className='text-base font-semibold text-gray-600'>
							Correo electrónico
						</label>
						<input
							type='email'
							name='correo'
							id='correo'
							placeholder='ejemplo@dominio'
							className='w-full outline-none border border-gray-300 duration-200 focus:border-[var(--colorPrimario)] px-3 py-2 rounded-2xl text-sm'
						/>
					</div>

					{/* Pasword */}
					<div className='flex flex-col w-full gap-y-1 mb-8'>
						<label htmlFor='password' className='text-base font-semibold text-gray-600'>
							Contraseña
						</label>
						<input
							type='password'
							name='password'
							id='password'
							placeholder='********'
							className='w-full outline-none border border-gray-300 duration-200 focus:border-[var(--colorPrimario)] px-3 py-2 rounded-2xl text-sm'
						/>
					</div>
					<input type='submit' value='Login' className='w-full py-3 rounded-full bg-[var(--colorPrimario)] text-base font-semibold text-white hover:opacity-80 duration-200 cursor-pointer shadow-lg mb-3' />
					<p className='text-xs font-base'>¿No tienes cuenta?
						<Link to='/' className='font-semibold text-[var(--colorPrimario)] hover:opacity-80 duration-200' > Crear cuenta</Link>
					</p>
				</form>
			</div>
		</div>
	)
}

export default Login
