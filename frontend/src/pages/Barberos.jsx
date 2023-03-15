import BarberoCard from '../components/BarberoCard'
import DashboardHeader from '../components/DashboardHeader'
import DashboardContainer from '../components/DashboardContainer'
import BuscadorAdmin from '../components/BuscadorAdmin'
import BigButton from '../components/BigButton'

// Iconos
import { GoPlus } from 'react-icons/go'

const Barberos = () => {
	return (
		<>
			<DashboardHeader titulo='Barberos' />
			<DashboardContainer>
				{/* Buscador */}
				<div className='flex justify-between items-center gap-x-5'>
					<BuscadorAdmin
						id='buscadorBarbero'
						placeholder='Escribe el nombre del barbero'
					/>
					<BigButton
						type='submit'
						texto='Barbero'
						icono={<GoPlus className='text-xl' />}
					/>
				</div>
				{/* Contenedor de las Cards */}
				<div className='w-full h-max my-6 grid grid-cols-3 gap-3 2xl:grid-cols-4 xl:gap-6'>
					<BarberoCard
						img='https://elcomercio.pe/resizer/-OZqwZSaiqrZ_moopwodC_iJcRs=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/FHVPWJMHKVFJ7MNVVGKJZL5JA4.png'
						nombre='Daniel'
						servicios={12}
						pendientes={2}
						puntaje={4.8}
					/>
					<BarberoCard
						img='https://elcomercio.pe/resizer/-OZqwZSaiqrZ_moopwodC_iJcRs=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/FHVPWJMHKVFJ7MNVVGKJZL5JA4.png'
						nombre='Daniel'
						servicios={12}
						pendientes={2}
						puntaje={4.8}
					/>
					<BarberoCard
						img='https://elcomercio.pe/resizer/-OZqwZSaiqrZ_moopwodC_iJcRs=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/FHVPWJMHKVFJ7MNVVGKJZL5JA4.png'
						nombre='Daniel'
						servicios={12}
						pendientes={2}
						puntaje={4.8}
					/>
					<BarberoCard
						img='https://elcomercio.pe/resizer/-OZqwZSaiqrZ_moopwodC_iJcRs=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/FHVPWJMHKVFJ7MNVVGKJZL5JA4.png'
						nombre='Daniel'
						servicios={12}
						pendientes={2}
						puntaje={4.8}
					/>
					<BarberoCard
						img='https://elcomercio.pe/resizer/-OZqwZSaiqrZ_moopwodC_iJcRs=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/FHVPWJMHKVFJ7MNVVGKJZL5JA4.png'
						nombre='Daniel'
						servicios={12}
						pendientes={2}
						puntaje={4.8}
					/>
					<BarberoCard
						img='https://elcomercio.pe/resizer/-OZqwZSaiqrZ_moopwodC_iJcRs=/1200x1200/smart/filters:format(jpeg):quality(75)/cloudfront-us-east-1.images.arcpublishing.com/elcomercio/FHVPWJMHKVFJ7MNVVGKJZL5JA4.png'
						nombre='Daniel'
						servicios={12}
						pendientes={2}
						puntaje={4.8}
					/>
					<BarberoCard
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

export default Barberos
