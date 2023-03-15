import DashboardHeader from '../components/DashboardHeader'
import DashboardContainer from '../components/DashboardContainer'
import ClienteCard from '../components/ClienteCard'
import BuscadorAdmin from '../components/BuscadorAdmin'

const Clientes = () => {
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
					<ClienteCard
						img='https://elcomercio.pe/resizer/-OZqwZSaiqrZ_moopwodC_iJcRs=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/FHVPWJMHKVFJ7MNVVGKJZL5JA4.png'
						nombre='Daniel'
						servicios={12}
						pendientes={2}
						puntaje={4.8}
					/>
				</div>
			</DashboardContainer>
		</>
	)
}

export default Clientes
