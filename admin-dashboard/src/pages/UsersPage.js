import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Table from '../components/Table'
import TableCell from '../components/TableCell'
import TableRow from '../components/TableRow'
import NavBar from '../components/NavBar'
import PageHeader from '../components/PageHeader'

function UsersPage() {
	
	const [users, setUsers] = useState([])
	const [page, setPage] = useState(1)
	const [stats, setStats] = useState({})

	useEffect(() => {
		const fetchUsers = async () => {
			const response = await fetch(`/api/admin/get/users?page=${page}`)
			const data = await response.json()
			if (data.error) return alert(data.error)
			setUsers(data.users)
			setStats({ ...data, users: null})
		}
		fetchUsers()
	}, [])

	return (
		<>
			<NavBar />
			<div className='page-container'>
				<PageHeader title="Post's Data" current={stats.current} total={stats.total_items} />
				<Table>
					<TableRow>
						<TableCell head={true}>S.No.</TableCell>
						<TableCell head={true}>Id</TableCell>
						<TableCell head={true}>Name</TableCell>
						<TableCell head={true}>Email</TableCell>
						<TableCell head={true}>Edit</TableCell>
					</TableRow>
					{users.map((user, index)=>{
						return (
							<TableRow key={user._id}>
								<TableCell>{(page-1)*10+(index+1)}</TableCell>
								<TableCell><Link to={'/users/'+user._id}>{user._id}</Link></TableCell>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell><Link to={'/users/'+user._id}>Edit</Link></TableCell>
							</TableRow>
						)
					})}
				</Table>
			</div>
		</>
	)
}

export default UsersPage