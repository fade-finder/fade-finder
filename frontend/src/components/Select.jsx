const Select = ({id, opciones}) => {
	return (
		<select
			name={id}
			id={id}
			className='w-[200px] py-1 text-lg font-light rounded-md outline-none border focus:border-[var(--colorPrimario)] duration-200'
		>
      {
        opciones.map(opcion => (
          <option value={opcion.value} key={opcion.value}>{opcion.texto}</option>
        ))
      }
			
		</select>
	)
}

export default Select
