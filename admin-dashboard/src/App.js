import { useEffect, useState } from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate
} from 'react-router-dom'
import AuthProvider from './contexts/AuthContext'
import GroupPage from './pages/GroupPage'
import GroupsPage from './pages/GroupsPage'
import HomaPage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PostPage from './pages/PostPage'
import PostsPage from './pages/PostsPage'
import UserPage from './pages/UserPage'
import UsersPage from './pages/UsersPage'
import './styles/App.css'

function App() {

	const [user, setUser] = useState(null)

	const login = _user => setUser(_user)
	const logout = () => setUser(null)

	useEffect(() => {
		const token = localStorage.getItem('token')
		if (token) setUser({ token })
	}, [])

	if (!user) {
		return (
			<AuthProvider value={{ user, login, logout }} >
				<Router>
					<Routes>
						<Route path='/' element={<LoginPage />} />
						<Route path='*' element={<Navigate to='/' />} />
					</Routes>
				</Router>
			</AuthProvider>
		)
	}

	return (
		<AuthProvider value={{ user, login, logout }} >
			<Router>
				<Routes>
					<Route path='/' element={<HomaPage />} />
					<Route path='/posts' element={<PostsPage />} />
					<Route path='/groups' element={<GroupsPage />} />
					<Route path='/users' element={<UsersPage />} />

					<Route path='/users/:id' element={<UserPage />} />
					<Route path='/posts/:id' element={<PostPage />} />
					<Route path='/groups/:id' element={<GroupPage />} />
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App
