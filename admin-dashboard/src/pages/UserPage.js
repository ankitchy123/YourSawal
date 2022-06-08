import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Table from "../components/Table";
import TableCell from "../components/TableCell";
import TableRow from "../components/TableRow";

function UserPage() {

	const { id } = useParams()
	const [user, setUser] = useState({})

	const updateUser = async () => {
		const response = await fetch('/api/admin/set/users/'+id, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(user)
		})
		const data = await response.json()
		if (data.error) return alert(data.error)
		alert(data.message)
	}

	const deleteUser = async () => {
		const response = await fetch('/api/admin/delete/users/'+id)
		const data = await response.json()
		if (data.error) return alert(data.error)
		alert(data.message)
	}

	const inputChange = (key, value) => {
		const newUser = { ...user }
		newUser[key] = value
		setUser(newUser)
	}

	useEffect(() => {
		const fetchUser = async () => {
			const response = await fetch('/api/admin/get/users/'+id)
			const data = await response.json()
			if (data.error) return alert(data.error)
			setUser(data)
		}
		fetchUser()
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
					{ Object.entries(user).map((entry, index)=>{
						if (typeof entry[1] !== 'object')
						return (
							<TableRow key={index}>
								<TableCell>{entry[0]}</TableCell>
								<TableCell>
									<input value={entry[1].toString()} onChange={event=>inputChange(entry[0], event.target.value)} />
								</TableCell>
							</TableRow>
						)
						else return ""
					}) }
				</Table>
				<div className="action-container">
					<button className="action-button" onClick={updateUser}>Save</button>
					<button className="action-button action-delete" onClick={deleteUser}>Delete</button>
				</div>
			</div>
		</>
	)
}

export default UserPage