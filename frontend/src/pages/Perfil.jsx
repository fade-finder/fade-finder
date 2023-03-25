import { AiOutlineLeft } from 'react-icons/ai'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Input from '../components/Input'
import SmallButton from '../components/SmallButton'
import Header from '../components/Header'
import Swal from 'sweetalert2'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Perfil = () => {
	const navigate = useNavigate()
	const [usuario, setUsuario] = useState({
		id: '1',
		email: '',
		password: '',
		nombre: '',
		ap_paterno: '',
		ap_materno: '',
		telefono: '',
		foto: '',
		rol: '0',
	})

	// Funciones
	const changeStateValue = (name, value) => {
		setUsuario({
			...usuario,
			[name]: value,
		})
	}

	const handleClickGuardarTodo = () => {}

	const handleClickEliminarCuenta = async () => {
		const { isConfirmed } = await Swal.fire({
			title: '¿Estas seguro?',
			text: 'No podras revertir la acción',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Si, eliminar',
			cancelButtonText: 'No',
		})
		if (isConfirmed) {
			try {
				const res = await axios.delete('http://localhost:3000/cliente/perfil/' + usuario.id)
				if(res.data.affectedRows > 0) {
					Swal.fire({
						title: 'Cuenta eliminada!',
						text: 'La cuenta fue eliminada de la base de datos',
						icon: 'success',
						showConfirmButton: false,
						timer: 2000,
					})
					setTimeout(() => {
						navigate('/login')
					}, 2000)
				} else {
					Swal.fire(
						'Error',
						'No se pudo eliminar la cuenta de la base de datos',
						'error'
					)
				}
			} catch (error) {
				Swal.fire('Error', error, 'error')
			}
		}
	}

	return (
		<div className='px-[140px] py-20 pt-[160px] min-h-screen w-full bg-[#F5F8FE] flex justify-center'>
			<Header />
			<div className='w-full max-w-[1080px]'>
				<div>
					<Link to='/dashboard'>
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
								<h2 className='text-xl font-semibold uppercase text-gray-800'>
									Daniel Ramón Solís Medina
								</h2>
							</div>
						</div>

						{/* Nombres */}
						<div className='w-full bg-white rounded-md shadow-md flex flex-col justify-center items-start gap-y-5 py-10 px-12'>
							<Input
								label='Nombre'
								type='text'
								name='nombre'
								id='nombre'
								placeholder='Actualiza tu nombre'
								value={usuario.nombre}
								onChange={e => changeStateValue(e.target.id, e.target.value)}
							/>
							<Input
								label='Apellido paterno'
								type='text'
								name='ap_paterno'
								id='ap_paterno'
								placeholder='Actualiza tu apellido paterno'
								value={usuario.ap_paterno}
								onChange={e => changeStateValue(e.target.id, e.target.value)}
							/>
							<Input
								label='Apellido materno'
								type='text'
								name='ap_materno'
								id='ap_materno'
								placeholder='Actualiza tu apellido materno'
								value={usuario.ap_materno}
								onChange={e => changeStateValue(e.target.id, e.target.value)}
							/>
						</div>
					</div>
					<div className='min-h-[500px] w-1/2 flex flex-col gap-y-8'>
						<div className='w-full bg-white rounded-md shadow-md flex flex-col justify-center items-start gap-y-5 py-10 px-12'>
							<Input
								label='Número telefónico'
								type='text'
								name='telefono'
								id='telefono'
								placeholder='Nuevo número telefónico'
								value={usuario.telefono}
								onChange={e => changeStateValue(e.target.id, e.target.value)}
							/>
							<Input
								label='Fotografía'
								type='file'
								name='foto'
								id='foto'
								placeholder='Nueva foto'
								value={usuario.foto}
								onChange={e => changeStateValue(e.target.id, e.target.value)}
							/>
						</div>
						<div className='w-full bg-white rounded-md shadow-md flex flex-col justify-center items-start gap-y-5 py-10 px-12'>
							<Input
								label='Email'
								type='email'
								name='email'
								id='email'
								placeholder=''
								value={usuario.email}
								onChange={e => changeStateValue(e.target.id, e.target.value)}
								activo={false}
							/>
							<Input
								label='Contraseña'
								type='text'
								name='password'
								id='password'
								placeholder='Nueva contraseña'
								value={usuario.password}
								onChange={e => changeStateValue(e.target.id, e.target.value)}
							/>
						</div>
						<div className='w-full flex flex-col justify-center items-start gap-y-5'>
							<SmallButton
								type='submit'
								texto='Guardar todo'
								onClick={() => handleClickGuardarTodo()}
							/>
							{usuario.rol == 0 && (
								<SmallButton
									type='submit'
									texto='Eliminar cuenta'
									onClick={() => handleClickEliminarCuenta()}
									color='bg-red-500'
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Perfil
