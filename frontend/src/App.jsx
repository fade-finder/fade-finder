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
				<Route path='/' element={<Layout />}>
					<Route index element={<LandingPage />} />
					<Route index path='register' element={<Register />} />
          <Route path='*' element={<NoPage />} />
				</Route>
				<Route>
					<Route path='login' element={<Login />} />
				</Route>
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
