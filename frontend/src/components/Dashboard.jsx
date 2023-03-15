// Components
import DashboardLink from './DashboardLink'

// Iconos
import { TbBusinessplan } from 'react-icons/tb'
import { BsFillJournalBookmarkFill, BsPersonSquare } from 'react-icons/bs'
import { RxPerson } from 'react-icons/rx'
import { BiCommentDetail } from 'react-icons/bi'

const Dashboard = () => {
	return (
		<div className='fixed top-0 bottom-0 left-0 min-w-[290px] max-h-screen bg-white shadow-sm rounded-r-md py-10 flex flex-col items-center select-none overflow-hidden'>
			<h2 className='text-2xl mb-5'>
				<span className='font-bold'>Fade</span> Finder
			</h2>
			<div className='w-full h-[1px] bg-[#00000083] mb-7'></div>
			<div className='w-full pl-8 flex flex-col gap-y-4'>
				<DashboardLink
					to='negocio'
					texto='Negocio'
					icono={<TbBusinessplan className='text-xl' />}
				/>
				<DashboardLink
					to='citas'
					texto='Citas'
					icono={<BsFillJournalBookmarkFill className='text-xl' />}
				/>
				<DashboardLink
					to='clientes'
					texto='Clientes'
					icono={<BsPersonSquare className='text-xl' />}
				/>
				<DashboardLink
					to='barberos'
					texto='Barberos'
					icono={<RxPerson className='text-xl' />}
				/>
				<DashboardLink
					to='resenas'
					texto='Reseñas'
					icono={<BiCommentDetail className='text-xl' />}
				/>
			</div>
		</div>
	)
}

export default Dashboard
