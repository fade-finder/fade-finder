import { Link } from 'react-scroll'
import { NavLink, useLocation } from 'react-router-dom'

const Navbar = () => {
	const location = useLocation()
	return (
		<nav className=''>
			<ul className='flex gap-x-5'>
				<li>
					{location.pathname == '/' ? (
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
					) : (
						<NavLink
							to='/'
							className={({ isActive }) => (isActive ? 'active' : '')}
						>
							Inicio
						</NavLink>
					)}
				</li>
				{location.pathname === '/' && (
					<>
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
					</>
				)}
				<li>
					<NavLink
						to='/dashboard/negocio'
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
