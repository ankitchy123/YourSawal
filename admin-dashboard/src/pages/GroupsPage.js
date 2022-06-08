import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import PageCounter from '../components/PageCounter'
import PageHeader from '../components/PageHeader'
import Table from '../components/Table'
import TableCell from '../components/TableCell'
import TableRow from '../components/TableRow'
import "../styles/GroupsPage.css"

function GroupsPage() {

	const [groups, setGroups] = useState([])
	const [page] = useState(1)
	const [totalPages, setTotalPages] = useState(0)
	const [stats, setStats] = useState({})

	useEffect(() => {
		const fetchGroups = async () => {
			const response = await fetch(`/api/admin/get/groups?page=${page}`)
			const data = await response.json()
			if (data.error) return alert(data.error)
			setGroups(data.groups)
			setStats({ ...data, groups: null})
			setTotalPages(data.total_page)
		}
		fetchGroups()
	}, [])

	return (
		<>
			<NavBar />
			<div className='page-container'>
				<PageHeader title="Group's Date" current={stats.current} total={stats.total_items} />
				<Table>
					<TableRow>
						<TableCell head={true}>S.No.</TableCell>
						<TableCell head={true}>Id</TableCell>
						<TableCell head={true}>Name</TableCell>
						<TableCell head={true}>Icon</TableCell>
						<TableCell head={true}>Admin</TableCell>
						<TableCell head={true}>Created On</TableCell>
						<TableCell head={true}>Edit</TableCell>
					</TableRow>
					{groups.map((group, index)=>{
						return (
							<TableRow key={group._id}>
								<TableCell>{(page-1)*10+(index+1)}</TableCell>
								<TableCell>
									<Link to={`/groups/${group._id}`}>{group._id}</Link>
								</TableCell>
								<TableCell>{group.group_name}</TableCell>
								<TableCell>{group.group_icon}</TableCell>
								<TableCell>
									<Link to={`/users/${group.admin}`}>{group.admin}</Link>
								</TableCell>
								<TableCell>{group.created_on}</TableCell>
								<TableCell><Link to={'/groups/'+group._id}>Edit</Link></TableCell>
							</TableRow>
						)
					})}
				</Table>
				<div>
					<PageCounter current={page} from={1} to={totalPages} url='/groups' />
				</div>
			</div>
		</>
	)
}

export default GroupsPage