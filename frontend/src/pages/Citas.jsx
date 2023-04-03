import DashboardHeader from '../components/DashboardHeader'
import DashboardContainer from '../components/DashboardContainer'
import BuscadorAdmin from '../components/BuscadorAdmin'
import CitaCard from '../components/CitaCard'
import CardWidget from '../components/CardWidget'
import Select from '../components/Select'

// iconos
import { BsCardList, BsClock } from 'react-icons/bs'
import { AiOutlineCheck } from 'react-icons/ai'
import { FiAlertTriangle } from 'react-icons/fi'

// Modulos
import Swal from 'sweetalert2'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { UPDATE_CITAS_CLIENTES } from '../redux/usuarioSlice'
import { useEffect, useState } from 'react'
import {
	formatearFecha,
	formatearDuracion,
	formatearHora,
} from '../utils/formateo'

const Citas = () => {
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * * *	G L O B A L E S		* * * * * * * * * * * * * * * * * * * * * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	const usuarioSlice = useSelector(state => state.usuario)
	const dispatch = useDispatch()
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * * *	U S E		S T A T E		* * * * * * * * * * * * * * * * * * * * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	const [citasCompletadas, setCitasCompletadas] = useState(0)
	const [citasConfirmadas, setCitasConfirmadas] = useState(0)
	const [citasPorConfirmar, setCitasPorConfirmar] = useState(0)
	const [citasCanceladas, setCitasCanceladas] = useState(0)
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * * *	U S E		E F F E C T		* * * * * * * * * * * * * * * * * * * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	useEffect(() => {
		if (usuarioSlice) {
			cargarDatosDeEstadoGlobal()
		}
	}, [usuarioSlice])

	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * * *		F U N C I O N E S		* * * * * * * * * * * * * * * * * * * * * * * * *
	// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	// Cargar los datos cuando termina de cargar el estado global
	const cargarDatosDeEstadoGlobal = () => {
		setCitasCompletadas(
			usuarioSlice.citasClientes?.filter(cita => cita.estado == 2)
		)
		setCitasConfirmadas(
			usuarioSlice.citasClientes?.filter(cita => cita.estado == 1)
		)
		setCitasPorConfirmar(
			usuarioSlice.citasClientes?.filter(cita => cita.estado == 0)
		)
		setCitasCanceladas(
			usuarioSlice.citasClientes?.filter(cita => cita.estado == 3)
		)
	}

	// Funcion para cancelar una cita
	const handleCancelarCita = async idCita => {
		const res = await Swal.fire({
			title: 'Cancelar cita',
			text: '¿Estas seguro que quieres cancelar esta cita? No podras deshacer esta acción',
			icon: 'warning',
			showCancelButton: true,
			cancelButtonText: 'No',
			cancelButtonColor: '#d33',
			confirmButtonColor: '#3085d6',
			confirmButtonText: 'Si, cancelar',
		})
		if (res.isConfirmed) {
			// Actualizamos en la bd
			const respuesta = await axios.put(
				'http://localhost:3000/cita/' + idCita,
				{ estado: 3 }
			)
			if (respuesta.data.affectedRows > 0) {
				Swal.fire(
					'Cita cancelada',
					'La cita fue cancelada correctamente',
					'success'
				)
				// Actualizamos en el estado global
				dispatch(UPDATE_CITAS_CLIENTES([idCita, { estado: 3 }]))
			}
		}
	}

	return (
		<>
			<DashboardHeader titulo='Citas' />
			<DashboardContainer>
				{/* Contenedor de widgets */}
				<div className='grid grid-cols-4 gap-x-6 mb-8'>
					<CardWidget
						texto='Citas completadas'
						numero={citasCompletadas.length}
						icono={<BsCardList className='text-2xl text-white' />}
						color='bg-green-500'
					/>
					<CardWidget
						texto='Citas confirmadas'
						numero={citasConfirmadas.length}
						icono={<BsClock className='text-2xl text-white' />}
						color='bg-blue-500'
					/>
					<CardWidget
						texto='Por confirmar'
						numero={citasPorConfirmar.length}
						icono={<AiOutlineCheck className='text-2xl text-white' />}
						color='bg-yellow-500'
					/>
					<CardWidget
						texto='Canceladas'
						numero={citasCanceladas.length}
						icono={<FiAlertTriangle className='text-2xl text-white' />}
						color='bg-red-500'
					/>
				</div>
				<div className='flex justify-between items-center gap-x-5'>
					{/* Buscador */}
					<BuscadorAdmin id='buscadorCita' placeholder='Buscar cita' />
					<div className='w-[200px]'>
						<Select
							id='selectorCita'
							opciones={[
								{ value: 'todas', texto: 'Todas' },
								{ value: 'realizadas', texto: 'Realizadas' },
								{ value: 'pendientes', texto: 'Pendientes' },
								{ value: 'por_confirmar', texto: 'Por confirmar' },
								{ value: 'canceladas', texto: 'Canceladas' },
							]}
						/>
					</div>
				</div>
				{/* Contenedor de las Cards */}
				<div className='w-full h-max flex gap-x-8 justify-between items-start my-6'>
					{/* Citas */}
					<div className='w-full flex flex-col justify-start gap-y-5'>
						{usuarioSlice.citasClientes?.map(cita => (
							<CitaCard
								key={cita.idCita}
								servicios={cita.servicios}
								hora={formatearHora(cita.hora)}
								cliente={`${cita.nombreCliente} ${cita.ap_paternoCliente} ${cita.ap_maternoCliente}`}
								barbero={`${cita.nombreBarbero} ${cita.ap_paternoBarbero}`}
								estado={cita.estado}
								onClickCancelar={() => handleCancelarCita(cita.idCita)}
							/>
						))}
					</div>
					{/* info de la cita */}
					<div className='w-[700px] 2xl:w-[900px] min-h-[200px] bg-white shadow-sm p-5 2xl:p-8'>
						<h2 className='text-lg font-semibold'>Sin información</h2>
						<p className='text-md font-light'>
							Seleccionia una cita para ver su información
						</p>
					</div>
				</div>
			</DashboardContainer>
		</>
	)
}

export default Citas
