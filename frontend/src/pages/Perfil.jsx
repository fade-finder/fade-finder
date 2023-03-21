import { AiOutlineLeft } from 'react-icons/ai'
import { Link } from 'react-router-dom'

import { useState } from 'react'

const Perfil = () => {
	const [usuario, setUsuario] = useState({
		email: '',
		password: '',
		nombre: '',
		ap_paterno: '',
		ap_materno: '',
		telefono: '',
		fecha_nacimiento: '',
		foto: '',
		calle: '',
		colonia: '',
		ciudad: '',
		numero: '',
	})
	return (
		<div className='px-[140px] py-20 min-h-screen w-full bg-[#F5F8FE] flex justify-center'>
			<div className='w-full max-w-[1080px]'>
				<div>
					<Link to='/admin'>
						<AiOutlineLeft className='text-2xl text-gray-700 hover:text-gray-900 duration-200' />
					</Link>
				</div>
				{/* Flex */}
				<div className='flex justify-center items-start gap-x-10 mt-8'>
					<div className='min-h-[500px] w-1/2 flex flex-col gap-y-8'>
						{/* Tarjeta */}
						<div className='relative h-[250px] w-full bg-white rounded-md shadow-md flex flex-col justify-center items-start'>
							<div className='h-1/2 bg-blue-700 w-full rounded-tr-md rounded-tl-md p-6'>
								<h2 className='text-xl font-semibold text-white'>Perfil</h2>
							</div>
							<div className='absolute w-[80px] h-[80px] rounded-full overflow-hidden top-[50%] left-10 -translate-y-1/2 '>
								<img
									src='https://www.edarling.es/wp-content/uploads/sites/24/2019/06/fotos_para_perfil_2.jpg'
									alt=''
								/>
							</div>
							<div className='h-1/2 w-full flex items-end p-6'>
								<h2 className='text-lg font-semibold'>
									Daniel Ramón Solís Medina
								</h2>
							</div>
						</div>

						{/* Nombres */}
						<div className='w-full bg-white rounded-md shadow-md flex flex-col justify-center items-start gap-y-3 py-6 px-10'>
							<h2 className='text-lg font-semibold'>Nombre completo</h2>
							<input
								type='text'
								name='nombre'
								id='nombre'
								placeholder='Nombre'
								className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400'
							/>
							<input
								type='text'
								name='ap_paterno'
								id='ap_paterno'
								placeholder='Apellido paterno'
								className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400'
							/>
							<input
								type='text'
								name='ap_materno'
								id='ap_materno'
								placeholder='Apellido materno'
								className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400'
							/>
						</div>
						{/* Direccion */}
						<div className='w-full bg-white rounded-md shadow-md flex flex-col justify-center items-start gap-y-3 py-6 px-10'>
							<h2 className='text-lg font-semibold'>Dirección</h2>
							<div className='flex justify-center items-center gap-x-5'>
								<input
									type='text'
									name='calle'
									id='calle'
									placeholder='Calle'
									className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400'
								/>
								<input
									type='text'
									name='colonia'
									id='colonia'
									placeholder='Colonia'
									className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400'
								/>
							</div>
							<div className='flex justify-center items-center gap-x-5'>
								<input
									type='text'
									name='ciudad'
									id='ciudad'
									placeholder='Ciudad'
									className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400'
								/>
								<input
									type='number'
									name='numero'
									id='numero'
									placeholder='Número exterior'
									className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400'
								/>
							</div>
						</div>
					</div>
					<div className='min-h-[500px] w-1/2 flex flex-col gap-y-8'>
						<div className='w-full bg-white rounded-md shadow-md flex flex-col justify-center items-start gap-y-3 py-6 px-10'>
							<h2 className='text-lg font-semibold'>Actualizar contraseña</h2>
							<input
								type='text'
								name='email'
								id='email'
								placeholder='Correo electrónico'
								disabled='on'
								className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400'
							/>
							<input
								type='password'
								name='password'
								id='password'
								placeholder='Contraseña'
								className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400 mb-3'
							/>
							<button className='bg-[var(--colorPrimario)] text-white px-4 py-2 rounded-sm hover:opacity-80'>
								Actualizar
							</button>
						</div>
						<div className='w-full bg-white rounded-md shadow-md flex flex-col justify-center items-start gap-y-3 py-6 px-10'>
							<input
								type='text'
								name='telefono'
								id='telefono'
								placeholder='Número telefónico'
								className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400'
							/>
							<input
								type='date'
								name='fecha_nacimiento'
								id='fecha_nacimiento'
								className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400'
							/>
							<input
								type='file'
								name='foto'
								id='foto'
								className='w-full text-lg font-light border-b outline-none px-3 py-2 duration-200 focus:border-b-gray-400'
							/>
						</div>
						<div className='w-full flex flex-col justify-center items-start gap-y-5'>
							<button className='bg-[var(--colorPrimario)] text-white px-4 py-2 rounded-sm hover:opacity-80'>
								Guardar todo
							</button>
							<button className='bg-red-500 text-white px-4 py-2 rounded-sm hover:opacity-80'>
								Eliminar cuenta
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Perfil
