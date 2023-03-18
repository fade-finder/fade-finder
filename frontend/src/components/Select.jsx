const Select = ({ id, opciones, value, onChange }) => {
	return (
		<select
			name={id}
			id={id}
			value={value}
			onChange={onChange}
			className='w-full py-1 text-lg font-light rounded-md outline-none border focus:border-[var(--colorPrimario)] duration-200'
		>
			<option value="" disabled >SELECCIONA UNA OPCION</option>
			{opciones.map(opcion => (
				<option value={opcion.value} key={opcion.value}>
					{opcion.texto}
				</option>
			))}
		</select>
	)
}

export default Select
