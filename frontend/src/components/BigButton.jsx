const BigButton = ({ type, texto, icono='' }) => {
	return (
		<button
			type={type}
			className='flex justify-center items-center gap-x-2 h-full px-4 py-2 rounded-md bg-[var(--colorPrimario)] text-white hover:opacity-80'
		>
			{icono && icono}
			<span>{texto}</span>
		</button>
	)
}

export default BigButton
