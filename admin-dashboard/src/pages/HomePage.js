import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'

function HomaPage() {

	const [stats, setStats] = useState({})

	useEffect(() => {
		const fetchStats = async () => {
			const response = await fetch('/api/admin/get/stats')
			const data = await response.json()
			if (data.error) return alert(data.error)
			setStats(data)
		}
		fetchStats()
	}, [])

	return (
		<>
			<NavBar />
			<div className='home-page-container'>
				<Link className='data-card' to="/users">
					<h3>Users</h3>
					<p>Total Items: {stats.total_users || 'Loading'}</p>
				</Link>
				<Link className='data-card' to="/posts">
					<h3>Posts</h3>
					<p>Total Items: {stats.total_posts || 'Loading'}</p>
				</Link>
				<Link className='data-card' to="/groups">
					<h3>Groups</h3>
					<p>Total Items: {stats.total_groups || 'Loading'}</p>
				</Link>
			</div>
		</>
	)
}

export default HomaPage