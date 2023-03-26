// Componentes
import DashboardHeader from '../components/DashboardHeader'
import CardWidget from '../components/CardWidget'
import Select from '../components/Select'
import Input from '../components/Input'
import SmallButton from '../components/SmallButton'
import BigButton from '../components/BigButton'

// Iconos
import { GiMoneyStack } from 'react-icons/gi'
import { AiOutlineCheck, AiOutlinePlusCircle } from 'react-icons/ai'
import { MdOutlinePending, MdOutlineCancel } from 'react-icons/md'

const Cliente = () => {
	const citas = false
	// const listaCitas = [
	//   {
	//     idCita: '1',
	//     estado: '0',
	//     fecha_creacion: '2020-01-18',
	//     horario: '11:30',
	//     duracion:
	//   }
	// ]
	return (
		<>
			<DashboardHeader largo={true} />
			<div className='mt-[100px] bg-[#F5F8FE] min-h-[calc(100vh-100px)] px-[100px] 2xl:px-[200px] py-[50px]'>
				{/* Contenedor de widgets */}
				<div className='grid grid-cols-4 gap-x-6 gap-y-12 mb-10'>
					<CardWidget
						texto='Citas concluidas'
						numero='5'
						icono={<AiOutlineCheck className='text-2xl text-white' />}
						color='bg-green-500'
					/>
					<CardWidget
						texto='Citas pendientes'
						numero='1'
						icono={<MdOutlinePending className='text-2xl text-white' />}
						color='bg-blue-500'
					/>
					<CardWidget
						texto='Citas canceladas'
						numero='2'
						icono={<MdOutlineCancel className='text-2xl text-white' />}
						color='bg-red-500'
					/>
					<CardWidget
						texto='Promedio por cita'
						dinero={true}
						numero='125.50'
						icono={<GiMoneyStack className='text-2xl text-white' />}
						color='bg-green-500'
					/>
					<div className='col-span-3'>
						<div className='min-h-[300px] p-14 bg-[#fff] rounded-sm shadow-md'>
							{!citas ? (
								<p className='text-lg font-semibold text-gray-700'>
									No hay citas
								</p>
							) : (
								<>
									<h2 className='text-lg font-bold text-gray-700'>Citas</h2>
								</>
							)}
						</div>
					</div>
					<div className='col-span-1'>
						<div className='p-10 bg-[#fff] rounded-sm shadow-md flex flex-col gap-y-8'>
							<form className='flex flex-col gap-y-2'>
								<Input
									label='Buscar'
									type='search'
									name='dato'
									id='dato'
									placeholder='Escribe algun dato'
									value=''
									onChange=''
								/>
								<SmallButton type='submit' texto='Buscar' onClick='' />
							</form>
							<div>
								<h4 className='text-base font-semibold text-gray-600'>
									Filtrar por
								</h4>
								<Select
									id='selectorCitaFiltro'
									opciones={[
										{ value: '1', texto: 'Recientes - Antiguas' },
										{ value: '2', texto: 'Antiguas - Recientes' },
										{ value: '3', texto: '1 Mes' },
										{ value: '4', texto: '3 Meses' },
										{ value: '5', texto: '6 Meses' },
										{ value: '6', texto: '1 Año' },
										{ value: '7', texto: 'Desde el inicio' },
									]}
								/>
							</div>
							<BigButton
								type='submit'
								texto='Agendar cita'
								icono={<AiOutlinePlusCircle className='text-xl' />}
								onClick=''
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Cliente
