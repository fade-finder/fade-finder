import { AiOutlineBell, AiOutlineComment } from 'react-icons/ai'
import { HiMoon } from 'react-icons/hi'
import { BiLogOut } from 'react-icons/bi'
import { Link } from 'react-router-dom'

const DashboardHeader = ({ titulo }) => {
	return (
		<div className='fixed z-40 top-0 right-0 left-[290px] bg-[#F5F8FE] h-[100px] flex justify-between items-center px-10'>
			<h1 className='text-3xl font-semibold'>{titulo}</h1>
			<div className='flex items-center gap-x-4 px-4 py-2 rounded-full bg-white shadow-sm'>
				<a href='/' className=''>
					<BiLogOut className='text-lg text-[#2424249c] hover:text-[#242424e5] duration-200' />
				</a>
				<button className='relative select-none'>
					<AiOutlineBell className='text-xl text-[#2424249c] hover:text-[#242424e5] duration-200' />
					<span className='absolute -top-[14px] left-2 bg-red-500 text-white rounded-full p-2 h-[20px] min-w-[20px] w-auto text-xs flex justify-center items-center'>
						50
					</span>
				</button>
				<button className='relative select-none'>
					<AiOutlineComment className='text-xl text-[#2424249c] hover:text-[#242424e5] duration-200' />
					<span className='absolute -top-[14px] left-2 bg-blue-500 text-white rounded-full p-2 h-[20px] min-w-[20px] w-auto text-xs flex justify-center items-center'>
						1
					</span>
				</button>
				<button>
					<HiMoon className='text-xl text-[#2424249c] hover:text-[#242424e5] duration-200' />
				</button>
				<Link to='/perfil'>
					<img
						className='rounded-full w-[40px] h-[40px]'
						src='https://editorialtelevisa.brightspotcdn.com/dims4/default/4876408/2147483647/strip/true/crop/1194x672+1+0/resize/1000x563!/quality/90/?url=https%3A%2F%2Fk2-prod-editorial-televisa.s3.amazonaws.com%2Fbrightspot%2Fwp-content%2Fuploads%2F2022%2F09%2F10-datos-curiosos-que-debes-saber-sobre-Mario-Bros.jpg'
						alt='Foto de perfil'
					/>
				</Link>
			</div>
		</div>
	)
}

export default DashboardHeader
