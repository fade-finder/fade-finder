import Swal from 'sweetalert2'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const validarEmail = email => {
  if(!emailRegex.test(email)) {
    Swal.fire(
      'Correo electrónico no válido',
      'El formato del correo electrónico es incorrecto',
      'error'
    )
    return false
  }
	return true
}
