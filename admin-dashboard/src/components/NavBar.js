import { Link } from 'react-router-dom'
import '../styles/NavBar.css'

function NavBar() {
	return (
		<nav className="navbar-container">
			<Link to="/">YourSawal • Admin</Link>
			<div className='nav-link-container'>
				<Link to="/users">Users</Link>
				<Link to="/posts">Posts</Link>
				<Link to="/groups">Groups</Link>
			</div>
		</nav>
	)
}

export default NavBar