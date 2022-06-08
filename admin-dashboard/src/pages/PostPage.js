import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Table from "../components/Table";
import TableCell from "../components/TableCell";
import TableRow from "../components/TableRow";

function PostPage() {

	const { id } = useParams()
	const [post, setPost] = useState({})

	const updatePost = async () => {
		const response = await fetch('/api/admin/set/posts/'+id, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(post)
		})
		const data = await response.json()
		if (data.error) return alert(data.error)
		alert(data.message)
	}

	const deletePost = async () => {
		const allow = window.confirm('You sure you wan to delete this?')
		if (allow) {
			const response = await fetch('/api/admin/delete/posts/'+id, {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-type': 'application/json',
				}
			})
			const data = await response.json()
			if (data.error) return alert(data.error)
			alert(data.message)
			window.location = '/posts'
		}
	}

	const onInputChange = (key, value) => {
		const newPost = {...post}
		newPost[key] = value
		setPost(newPost)
	}

	useEffect(() => {
		const fetchPost = async () => {
			const response = await fetch('/api/admin/get/posts/'+id)
			const data = await response.json()
			if (data.error) return alert(data.error)
			setPost(data)
		}
		fetchPost()
	}, [])

	return (
		<>
			<NavBar />
			<div className="page-container">
				<Table>
					<TableRow>
						<TableCell head={true}>Key</TableCell>
						<TableCell head={true}>Value</TableCell>
					</TableRow>
					{ Object.entries(post).map((entry, index)=>{
						if (typeof entry[1] !== 'object')
						return (
							<TableRow key={index}>
								<TableCell>{entry[0]}</TableCell>
								<TableCell>
									<input value={entry[1].toString()} onChange={event=>onInputChange(entry[0], event.target.value)} />
								</TableCell>
							</TableRow>
						)
					}) }
				</Table>
				<div className="action-container">
					<button className="action-button" onClick={updatePost}>Save</button>
					<button className="action-button action-delete" onClick={deletePost}>Delete</button>
				</div>
			</div>
		</>
	)
}

export default PostPage