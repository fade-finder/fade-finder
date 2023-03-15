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


const Citas = () => {
	return (
		<>
			<DashboardHeader titulo='Citas' />
			<DashboardContainer>
				{/* Contenedor de widgets */}
				<div className='grid grid-cols-4 gap-x-6 mb-8'>
					<CardWidget
						texto='Realizadas'
						numero='30'
						icono={<BsCardList className='text-2xl text-white' />}
						color='bg-green-500'
					/>
					<CardWidget
						texto='En la fila'
						numero='14'
						icono={<BsClock className='text-2xl text-white' />}
						color='bg-blue-500'
					/>
					<CardWidget
						texto='Por confirmar'
						numero='5'
						icono={<AiOutlineCheck className='text-2xl text-white' />}
						color='bg-yellow-500'
					/>
					<CardWidget
						texto='Canceladas'
						numero='2'
						icono={<FiAlertTriangle className='text-2xl text-white' />}
						color='bg-red-500'
					/>
				</div>
				<div className='flex justify-between items-center gap-x-5'>
					{/* Buscador */}
					<BuscadorAdmin id='buscadorCita' placeholder='Buscar cita' />
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
				{/* Contenedor de las Cards */}
				<div className='w-full h-max flex gap-x-8 justify-between items-start my-6'>
					{/* Citas */}
					<div className='w-full flex flex-col justify-start gap-y-5'>
						<CitaCard
							servicio='Corte de cabello'
							hora='10:20 am'
							cliente='Daniel Ramón Solís Medina'
							barbero='Bryan Sanchez Lopez'
						/>
						<CitaCard
							servicio='Corte de cabello'
							hora='10:20 am'
							cliente='Daniel Ramón Solís Medina'
							barbero='Bryan Sanchez Lopez'
						/>
						<CitaCard
							servicio='Corte de cabello'
							hora='10:20 am'
							cliente='Daniel Ramón Solís Medina'
							barbero='Bryan Sanchez Lopez'
						/>
						<CitaCard
							servicio='Corte de cabello'
							hora='10:20 am'
							cliente='Daniel Ramón Solís Medina'
							barbero='Bryan Sanchez Lopez'
						/>
						<CitaCard
							servicio='Corte de cabello'
							hora='10:20 am'
							cliente='Daniel Ramón Solís Medina'
							barbero='Bryan Sanchez Lopez'
						/>
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
