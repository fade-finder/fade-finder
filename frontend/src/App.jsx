import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Pages
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import NoPage from './pages/NoPage'

import LayoutAdmin from './components/LayoutAdmin'
import Barberos from './pages/Barberos'
import Clientes from './pages/Clientes'
import Citas from './pages/Citas'
import Negocio from './pages/Negocio'
import Resenas from './pages/Resenas'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* plantilla header y footer */}
				<Route path='/' element={<Layout />}>
					<Route index element={<LandingPage />} />
          <Route path='*' element={<NoPage />} />
				</Route>
				{/* plantilla limpia */}
				<Route>
					<Route path='login' element={<Login />} />
					<Route path='/cliente/register' element={<Register />} />
				</Route>
				{/* Plantilla con dashboard */}
				<Route path='/admin' element={<LayoutAdmin />}>
					<Route index element={<Negocio />} />
					<Route path='negocio' element={<Negocio />} />
					<Route path='citas' element={<Citas />} />
					<Route path='clientes' element={<Clientes />} />
					<Route path='barberos' element={<Barberos />} />
					<Route path='resenas' element={<Resenas />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

// COMENTARIOS
// El path = '*' significa cualquier ruta que no exista

export default App
