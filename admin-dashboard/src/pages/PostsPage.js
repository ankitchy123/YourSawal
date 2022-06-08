import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Table from '../components/Table'
import TableCell from '../components/TableCell'
import TableRow from '../components/TableRow'
import NavBar from '../components/NavBar'
import PageHeader from '../components/PageHeader'

function PostsPage() {

	const [posts, setPosts] = useState([])
	const [page, setPage] = useState(1)
	const [stats, setStats] = useState({})

	useEffect(() => {
		const fetchPosts = async () => {
			const response = await fetch(`/api/admin/get/posts?page=${page}`)
			const data = await response.json()
			if (data.error) return alert(data.error)
			setPosts(data.posts)
			setStats({ ...data, posts: null})
		}
		fetchPosts()
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
						<TableCell head={true}>Body</TableCell>
						<TableCell head={true}>Admin</TableCell>
						<TableCell head={true}>Created On</TableCell>
						<TableCell head={true}>Edit</TableCell>
					</TableRow>
					{posts.map((post, index)=>{
						return (
							<TableRow key={post._id}>
								<TableCell>{(page-1)*10+(index+1)}</TableCell>
								<TableCell>
									<Link to={`/posts/${post._id}`}>{post._id}</Link>
								</TableCell>
								<TableCell>{post.body}</TableCell>
								{/* <TableCell>{post.group}</TableCell> */}
								<TableCell>
									<Link to={`/users/${post.author}`}>{post.author}</Link>
								</TableCell>
								<TableCell>{post.created_on}</TableCell>
								<TableCell><Link to={'/posts/'+post._id}>Edit</Link></TableCell>
							</TableRow>
						)
					})}
				</Table>
			</div>
		</>
	)
}

export default PostsPage