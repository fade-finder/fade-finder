import Dashboard from '../components/Dashboard'
// Hooks
import { Outlet } from 'react-router-dom'

const LayoutAdmin = () => {
	return (
		<div>
			<Dashboard />
			<Outlet />
		</div>
	)
}

export default LayoutAdmin
