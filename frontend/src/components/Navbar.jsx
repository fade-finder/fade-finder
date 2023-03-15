import { Link } from 'react-scroll'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
	return (
		<nav className=''>
			<ul className='flex gap-x-5'>
				<li>
					<Link
						className='cursor-pointer text-black font-medium'
						activeClass='active'
						to='inicio'
						spy={true}
						smooth={true}
						offset={-180}
						duration={500}
					>
						Inicio
					</Link>
				</li>
				<li>
					<Link
						className='cursor-pointer text-black font-medium'
						activeClass='active'
						to='servicios'
						spy={true}
						smooth={true}
						offset={-180}
						duration={500}
					>
						Servicios
					</Link>
				</li>
				<li>
					<Link
						className='cursor-pointer text-black font-medium'
						activeClass='active'
						to='galeria'
						spy={true}
						smooth={true}
						offset={-180}
						duration={500}
					>
						Galeria
					</Link>
				</li>
				{/* <li>
					<Link
						className='cursor-pointer text-black font-medium'
						activeClass='active'
						to='quienes-somos'
						spy={true}
						smooth={true}
						offset={-100}
						duration={500}
					>
						Quiénes somos
					</Link>
				</li> */}
				<li>
					<Link
						className='cursor-pointer text-black font-medium'
						activeClass='active'
						to='contactanos'
						spy={true}
						smooth={true}
						offset={-180}
						duration={500}
					>
						Contactanos
					</Link>
				</li>
				<li>
					<NavLink
						to='/admin/negocio'
						className={({ isActive }) =>
							isActive ? 'text-green-500' : 'text-black font-medium'
						}
					>
						Entrar
					</NavLink>
				</li>
			</ul>
		</nav>
	)
}

export default Navbar
