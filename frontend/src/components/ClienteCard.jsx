import { FaEdit } from 'react-icons/fa'
import { AiFillDelete } from 'react-icons/ai'

const ClienteCard = ({ img, nombre, servicios, pendientes}) => {
	return (
		<div className='bg-[#fff] flex flex-col gap-y-4 justify-center items-center p-10 rounded-lg hover:shadow-lg hover:-translate-y-2 duration-300 select-none'>
			<div className='w-[100px] h-[100px] rounded-full overflow-hidden'>
				<img src={img} alt={nombre} className='rounded-full' />
			</div>
			<div className='flex flex-col items-center'>
				<h2 className='text-xl font-medium'>{nombre}</h2>
				<span className='text-base font-light text-gray-500'>Cliente</span>
			</div>
			<div className='flex gap-x-6'>
				<div className='flex flex-col items-center justify-center'>
					<span className='text-3xl text-gray-800 font-semibold'>
						{servicios}
					</span>
					<h3 className='text-sm font-normal text-center'>Servicios tomados</h3>
				</div>
				<div className='flex flex-col items-center justify-center'>
					<span className='text-3xl text-gray-800 font-semibold'>
						{pendientes}
					</span>
					<h3 className='text-sm font-normal text-center'>Citas pendientes</h3>
				</div>
			</div>
		</div>
	)
}

export default ClienteCard
