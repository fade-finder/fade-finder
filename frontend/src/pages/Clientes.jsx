// Componentes
import DashboardHeader from '../components/DashboardHeader'
import DashboardContainer from '../components/DashboardContainer'
import ClienteCard from '../components/ClienteCard'
import BuscadorAdmin from '../components/BuscadorAdmin'

// Hooks
import { useState, useEffect } from 'react'

// Paquetes
import axios from 'axios'

const Clientes = () => {
	// useState
	const [clientes, setClientes] = useState([])
	
	// useEffect
	useEffect(() => {
		getClientes()
	}, [])

	// Funciones
	const getClientes = async () => {
		try {
			const res = await axios.get('http://localhost:3000/clientes')
			setClientes(res.data)
		} catch (error) {
			console.log(error)
		}
	}

	const onClickVer = () => {}

	// Renderizado
	return (
		<>
			<DashboardHeader titulo='Clientes' />
			<DashboardContainer>
				{/* Buscador */}
				<BuscadorAdmin
					id='buscadorCliente'
					placeholder='Escribe el nombre del cliente'
				/>
				{/* Contenedor de las Cards */}
				<div className='w-full h-max my-6 grid grid-cols-3 gap-3 2xl:grid-cols-4 xl:gap-6'>
					{clientes.map(cliente => (
						<ClienteCard
							key={cliente.idUsuario}
							img='https://elcomercio.pe/resizer/-OZqwZSaiqrZ_moopwodC_iJcRs=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/FHVPWJMHKVFJ7MNVVGKJZL5JA4.png'
							nombre={cliente.nombre}
							servicios={12}
							pendientes={2}
							onClickVer={() => console.log(cliente.idUsuario)}
						/>
					))}
				</div>
			</DashboardContainer>
		</>
	)
}

export default Clientes
