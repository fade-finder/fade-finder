// Iconos
import { AiOutlineBell, AiOutlineComment } from 'react-icons/ai'
import { HiMoon } from 'react-icons/hi'
import { BiLogOut } from 'react-icons/bi'

// Modulos
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { cleanUsuario } from '../redux/usuarioSlice'

const DashboardHeader = ({ titulo='', largo=false }) => {
	const dispatch = useDispatch()
	const usuarioSlice = useSelector(state => state.usuario)

	// Funciones
	const handleClickLogout = () => {
		Swal.fire({
			title: 'Hecho',
			text: 'Cerraste tu sesión',
			icon: 'success',
			showConfirmButton: false,
			timer: 2000,
		})
		setTimeout(() => {
			localStorage.removeItem('idToken')
			dispatch(cleanUsuario())
		}, 2000)
	}

	return (
		<div className={`fixed z-40 top-0 right-0 ${largo ? 'left-0' : 'left-[290px]'} bg-[#F5F8FE] h-[100px] flex justify-between items-center px-10`}>
			<h1 className='text-3xl font-semibold'>{titulo}</h1>
			<div className='flex items-center gap-x-6 px-6 py-3 rounded-full bg-white shadow-sm'>
				<button onClick={() => handleClickLogout()}>
					<BiLogOut className='text-lg 2xl:text-3xl text-[#2424249c] hover:text-[#242424e5] duration-200' />
				</button>
				<button className='relative select-none'>
					<AiOutlineBell className='text-xl 2xl:text-3xl text-[#2424249c] hover:text-[#242424e5] duration-200' />
					<span className='absolute -top-[14px] left-2 bg-red-500 text-white rounded-full p-2 h-[20px] min-w-[20px] w-auto text-xs flex justify-center items-center'>
						50
					</span>
				</button>
				<button className='relative select-none'>
					<AiOutlineComment className='text-xl 2xl:text-3xl  text-[#2424249c] hover:text-[#242424e5] duration-200' />
					<span className='absolute -top-[14px] left-2 bg-blue-500 text-white rounded-full p-2 h-[20px] min-w-[20px] w-auto text-xs flex justify-center items-center'>
						1
					</span>
				</button>
				<button>
					<HiMoon className='text-xl 2xl:text-3xl  text-[#2424249c] hover:text-[#242424e5] duration-200' />
				</button>
				<Link to='/perfil'>
					<img
						className='rounded-full w-[40px] h-[40px] 2xl:w-[45px] 2xl:h-[45px]'
						src={usuarioSlice.foto}
						alt={`Foto de perfil de ${usuarioSlice.nombre}`}
					/>
				</Link>
			</div>
		</div>
	)
}

export default DashboardHeader
