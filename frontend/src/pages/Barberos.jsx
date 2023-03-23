import BarberoCard from '../components/BarberoCard'
import DashboardHeader from '../components/DashboardHeader'
import DashboardContainer from '../components/DashboardContainer'
import BuscadorAdmin from '../components/BuscadorAdmin'
import BigButton from '../components/BigButton'
import VentanaModal from '../components/VentanaModal'
// Componentes modal
import Input from '../components/Input'
import Select from '../components/Select'
// Modulos
import axios from 'axios'
import Swal from 'sweetalert2'
// Iconos
import { GoPlus } from 'react-icons/go'
import { FaEdit } from 'react-icons/fa'
// Hooks
import { useState, useEffect } from 'react'
// Data
// import { barberos } from '../../../backend/utils/barberosData'

const Barberos = () => {
	// * * * * * * * * * * * * * * * USE STATE * * * * * * * * * * * * * *
	const [ventanaModal, setVentanaModal] = useState(false)
	const [editando, setEditando] = useState(false)
	const [barberos, setBarberos] = useState([])
	const [barbero, setBarbero] = useState({
		email: '',
		password: '',
		nombre: '',
		ap_paterno: '',
		ap_materno: '',
		genero: '',
		telefono: '',
		fecha_nacimiento: '',
		foto: '',
		calle: '',
		colonia: '',
		ciudad: '',
		numero: '',
	})

	// * * * * * * * * * * * * * * * USE EFFECT * * * * * * * * * * * * * *
	useEffect(() => {
		if (editando) {
			setBarbero({ ...barbero })
			setVentanaModal(true)
		} else {
			limpiarCampos()
		}
	}, [editando])

	useEffect(() => {
		getBarberos()
	}, [])

	// * * * * * * * * * * * * * * * FUNCIONES * * * * * * * * * * * * * *

	// Funcion para acutalizar el estado de mi objeto
	const changeInputValue = (tag, value) => {
		setBarbero({
			...barbero,
			[tag]: value,
		})
	}

	// Funcion para cerrar la ventana modal
	const cerrarVentanaModal = () => {
		setVentanaModal(false)
		if (editando) setEditando(false)
	}

	// Funcion para limpiar los campos de la ventana modal
	const limpiarCampos = () => {
		setBarbero({
			email: '',
			password: '',
			nombre: '',
			ap_paterno: '',
			ap_materno: '',
			genero: '',
			telefono: '',
			fecha_nacimiento: '',
			foto: '',
			calle: '',
			colonia: '',
			ciudad: '',
			numero: '',
		})
	}

	// Funcion para traer los barberos del backend, la utilizo cuando se esta renderizando la pagina
	const getBarberos = async () => {
		try {
			const res = await axios.get('http://localhost:3000/barberos')
			setBarberos(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	// Funcion que carga los datos del barbero seleccionado para editar al formulario
	const cargarDatosBarberoFormulario = id => {
		const barberoEditar = barberos.filter(barbero => barbero.idBarbero == id)
		setBarbero(barberoEditar[0])
		setEditando(true)
	}

	// Funcion para agregar un nuevo barbero a la bd
	const onClickAddBarbero = async e => {
		e.preventDefault()
		setVentanaModal(false)
		try {
			const res = await axios.post(
				'http://localhost:3000/admin/barberos/agregar',
				barbero
			)
			console.log(res.data)
			limpiarCampos()
			getBarberos()
			cerrarVentanaModal()
			Swal.fire({
				icon: 'success',
				title: 'Barbero agregado',
				showConfirmButton: false,
				timer: 2000,
			})
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: error.message + ': ' + error.code,
			})
		}
	}

	// Funcion para actualizar un barbero
	const onClickUpdateBarbero = async e => {
		e.preventDefault()
		setVentanaModal(false)
		try {
			const res = await axios.put(
				'http://localhost:3000/admin/barberos/' + barbero.idBarbero,
				barbero
			)
			console.log(res.data)
			limpiarCampos()
			getBarberos()
			cerrarVentanaModal()
			Swal.fire({
				icon: 'success',
				title: 'Barbero actualizado',
				showConfirmButton: false,
				timer: 2000,
			})
		} catch (error) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: error.message + ': ' + error.code,
			})
		}
	}

	// Funcion para eliminar a un barbero
	const onClickDeleteBarbero = async id => {
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
				const res = await axios.delete(
					'http://localhost:3000/admin/barberos/' + id
				)
				console.log(res.data)
				Swal.fire(
					'Eliminado!',
					'El barbero fue eliminado del sistema',
					'success'
				)
				const barberosFiltrados = barberos.filter(barbero => barbero.id != id)
				setBarberos(barberosFiltrados)
			} catch (error) {
				Swal.fire({
					icon: 'error',
					title: 'Error',
					text: error.message + ': ' + error.code,
				})
			}
		}
	}

	// * * * * * * * * * * * * * * * RENDERIZADO * * * * * * * * * * * * * *
	return (
		<>
			{ventanaModal && (
				<VentanaModal
					cerrarModal={() => cerrarVentanaModal()}
					titulo={editando ? 'Editar barbero' : 'Agregar barbero'}
				>
					<div className='flex justify-between items-center gap-x-8'>
						{/* Email */}
						<Input
							label='Correo electrónico'
							type='email'
							name='email'
							id='email'
							placeholder='Escribe el correo electrónico'
							value={barbero.email}
							onChange={e => changeInputValue(e.target.id, e.target.value)}
						/>
						{/* Password */}
						<Input
							label='Contraseña'
							type='text'
							name='password'
							id='password'
							placeholder='Establece una contraseña'
							value={barbero.password}
							onChange={e => changeInputValue(e.target.id, e.target.value)}
						/>
					</div>
					<div className='w-full h-[1px] bg-[#0000002d] my-4'></div>
					{/* Nombre */}
					<Input
						label='Nombre(s)'
						type='text'
						name='nombre'
						id='nombre'
						placeholder='Escribe el nombre'
						value={barbero.nombre}
						onChange={e => changeInputValue(e.target.id, e.target.value)}
					/>
					<div className='flex justify-between items-center gap-x-8'>
						{/* Apellido paterno */}
						<Input
							label='Apellido Paterno'
							type='text'
							name='ap_paterno'
							id='ap_paterno'
							placeholder='Escribe el apellido paterno'
							value={barbero.ap_paterno}
							onChange={e => changeInputValue(e.target.id, e.target.value)}
						/>
						{/* Apellido materno */}
						<Input
							label='Apellido Materno'
							type='text'
							name='ap_materno'
							id='ap_materno'
							placeholder='Escribe el apellido materno'
							value={barbero.ap_materno}
							onChange={e => changeInputValue(e.target.id, e.target.value)}
						/>
					</div>
					<div className='flex justify-between items-center gap-x-8'>
						{/* Genero */}
						<div className='flex flex-col justify-between w-full h-full'>
							<label
								htmlFor='genero'
								className='text-base font-semibold text-gray-600'
							>
								Genero
							</label>
							<Select
								id='genero'
								value={barbero.genero}
								onChange={e => changeInputValue(e.target.id, e.target.value)}
								opciones={[
									{ value: 'm', texto: 'Masculino' },
									{ value: 'f', texto: 'Femenino' },
								]}
							/>
						</div>
						{/* Telefono */}
						<Input
							label='Número Telefónico'
							type='text'
							name='telefono'
							id='telefono'
							placeholder='Escribe el número telefónico'
							value={barbero.telefono}
							onChange={e => changeInputValue(e.target.id, e.target.value)}
						/>
					</div>
					<div className='flex justify-between items-center gap-x-8'>
						{/* Foto */}
						{editando ? (
							<div className='flex flex-col w-full gap-y-1'>
								<label
									htmlFor='correo'
									className='text-base font-semibold text-gray-600'
								>
									Foto de perfil
								</label>
								<input
									type='file'
									name='foto'
									id='foto'
									onChange={e => changeInputValue(e.target.id, e.target.value)}
									className='w-full outline-none border border-gray-300 duration-200 focus:border-[var(--colorPrimario)] px-3 py-2 text-sm'
								/>
							</div>
						) : (
							<Input
								label='Foto de perfil'
								type='file'
								name='foto'
								id='foto'
								placeholder='Selecciona una foto'
								value={barbero.foto}
								onChange={e => changeInputValue(e.target.id, e.target.value)}
							/>
						)}
						{/* Fecha de nacimiento */}
						<Input
							label='Fecha de nacimiento'
							type='date'
							name='fecha_nacimiento'
							id='fecha_nacimiento'
							placeholder='Escribe la fecha de nacimiento'
							value={barbero.fecha_nacimiento}
							onChange={e => changeInputValue(e.target.id, e.target.value)}
						/>
					</div>
					<div className='w-full h-[1px] bg-[#0000002d] my-4'></div>
					<div className='flex justify-between items-center gap-x-8'>
						{/* Calle */}
						<Input
							label='Calle'
							type='text'
							name='calle'
							id='calle'
							placeholder='Escribe el nombre de la calle'
							value={barbero.calle}
							onChange={e => changeInputValue(e.target.id, e.target.value)}
						/>
						{/* Colornia */}
						<Input
							label='Colonia'
							type='text'
							name='colonia'
							id='colonia'
							placeholder='Escribe el nombre de la colonia'
							value={barbero.colonia}
							onChange={e => changeInputValue(e.target.id, e.target.value)}
						/>
					</div>
					<div className='flex justify-between items-center gap-x-8 mb-5'>
						{/* Ciudad */}
						<Input
							label='Ciudad'
							type='text'
							name='ciudad'
							id='ciudad'
							placeholder='Escribe el nombre de la ciudad'
							value={barbero.ciudad}
							onChange={e => changeInputValue(e.target.id, e.target.value)}
						/>
						{/* Numero exterior */}
						<Input
							label='Número exterior'
							type='number'
							name='numero'
							id='numero'
							placeholder='Escribe el número exterior'
							value={barbero.numero}
							onChange={e => changeInputValue(e.target.id, e.target.value)}
						/>
					</div>
					<div>
						<BigButton
							type='submit'
							texto={editando ? 'Editar barbero' : 'Agregar barbero'}
							onClick={
								editando
									? e => onClickUpdateBarbero(e)
									: e => onClickAddBarbero(e)
							}
							icono={
								editando ? (
									<FaEdit className='text-xl' />
								) : (
									<GoPlus className='text-xl' />
								)
							}
						/>
					</div>
				</VentanaModal>
			)}
			<DashboardHeader titulo='Barberos' />
			<DashboardContainer>
				{/* Buscador */}
				<div className='flex justify-between items-center gap-x-5'>
					<BuscadorAdmin
						id='buscadorBarbero'
						placeholder='Escribe el nombre del barbero'
					/>
					<BigButton
						type='submit'
						texto='Barbero'
						onClick={() => setVentanaModal(true)}
						icono={<GoPlus className='text-xl' />}
					/>
				</div>
				{/* Contenedor de las Cards */}
				<div className='w-full h-max my-6 grid grid-cols-3 gap-3 2xl:grid-cols-4 xl:gap-6'>
					{barberos.map(barbero => (
						<BarberoCard
							key={barbero.idBarbero}
							img='https://elcomercio.pe/resizer/-OZqwZSaiqrZ_moopwodC_iJcRs=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/FHVPWJMHKVFJ7MNVVGKJZL5JA4.png'
							nombre={barbero.nombre}
							servicios={12}
							pendientes={2}
							puntaje={4.8}
							onClickEditar={() => cargarDatosBarberoFormulario(barbero.idBarbero)}
							onClickEliminar={() => onClickDeleteBarbero(barbero.idBarbero)}
						/>
					))}
				</div>
			</DashboardContainer>
		</>
	)
}

export default Barberos
