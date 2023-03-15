// iconos
import { AiFillEye } from 'react-icons/ai'
import { TiCancel } from 'react-icons/ti'

const CitaCard = ({ servicio, hora, cliente, barbero }) => {
	return (
		<div className='w-full min-h-[100px] hover:shadow-md bg-white borderborder-gray-200 hover:border-l-4 hover:border-[var(--colorPrimario)] hover:translate-x-2 duration-200 px-8 py-6 flex justify-between items-center select-none'>
			{/* informacion */}
			<div>
				<div className='flex gap-x-8 items-center'>
					<span className='text-lg text-gray-500 font-light'>{hora}</span>
          <span className='text-sm text-gray-500 font-light'>{cliente}</span>
				</div>
				<h2 className='text-3xl text-black font-semibold'>{servicio}</h2>
				<span className='text-sm text-gray-500 font-normal'>Barbero: <span className='text-[var(--colorPrimario)] font-bold'>{barbero}</span></span>
			</div>

			{/* Iconos */}
			<div className='flex justify-center items-center gap-x-4'>
				<button>
					<AiFillEye className='text-4xl text-blue-500 hover:opacity-70' />
				</button>
				<button>
					<TiCancel className='text-4xl text-red-500 hover:opacity-70' />
				</button>
			</div>
		</div>
	)
}

export default CitaCard
