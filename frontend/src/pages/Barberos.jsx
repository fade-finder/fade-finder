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
		telefono: '',
		foto: '',
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
			telefono: '',
			foto: '',
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
		const barberoEditar = barberos.filter(barbero => barbero.idUsuario == id)
		setBarbero(barberoEditar[0])
		setEditando(true)
	}

	// Funcion para agregar un nuevo barbero a la bd
	const onClickAddBarbero = async e => {
		e.preventDefault()
		setVentanaModal(false)
		try {
			await axios.post('http://localhost:3000/admin/barberos/agregar', barbero)
			limpiarCampos()
			getBarberos()
			cerrarVentanaModal()
			Swal.fire(
				'Barbero agregado',
				'El barbero fue agregado correctamente',
				'success'
			)
		} catch (error) {
			Swal.fire('Error', error.name + ': ' + error.message, 'error')
		}
	}

	// Funcion para actualizar un barbero
	const onClickUpdateBarbero = async e => {
		e.preventDefault()
		setVentanaModal(false)
		try {
			await axios.put(
				'http://localhost:3000/admin/barberos/' + barbero.idUsuario,
				barbero
			)
			limpiarCampos()
			getBarberos()
			cerrarVentanaModal()
			Swal.fire(
				'Barbero actualizado',
				'El barbero fue actualizado correctamente',
				'success'
			)
		} catch (error) {
			Swal.fire('Error', error.name + ': ' + error.message, 'error')
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
				await axios.delete('http://localhost:3000/admin/barberos/' + id)
				Swal.fire(
					'Eliminado!',
					'El barbero fue eliminado del sistema',
					'success'
				)
				const barberosFiltrados = barberos.filter(
					barbero => barbero.idUsuario != id
				)
				setBarberos(barberosFiltrados)
			} catch (error) {
				Swal.fire('Error', error.name + ': ' + error.message, 'error')
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
					<div className='w-full h-[1px] bg-[#0000002d] my-2'></div>
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
							key={barbero.idUsuario}
							img={barbero.foto}
							nombre={barbero.nombre}
							servicios={12}
							pendientes={2}
							puntaje={4.8}
							onClickEditar={() =>
								cargarDatosBarberoFormulario(barbero.idUsuario)
							}
							onClickEliminar={() => onClickDeleteBarbero(barbero.idUsuario)}
						/>
					))}
				</div>
			</DashboardContainer>
		</>
	)
}

export default Barberos
