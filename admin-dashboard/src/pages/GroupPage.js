import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Table from "../components/Table";
import TableCell from "../components/TableCell";
import TableRow from "../components/TableRow";

function GroupPage() {

	const { id } = useParams()
	const [group, setGroup] = useState({})

	const updateGroup = async () => {
		const response = await fetch('/api/admin/set/groups/'+id, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-type': 'application/json'
			},
			body: JSON.stringify(group)
		})
		const data = await response.json()
		if (data.error) return alert(data.error)
		alert(data.message)
	}

	const deleteGroup = async () => {
		const response = await fetch('/api/admin/delete/groups/'+id)
		const data = await response.json()
		if (data.error) return alert(data.error)
		alert(data.message)
	}

	const onInputChange = (key, value) => {
		const newGroup = {...group}
		newGroup[key] = value
		setGroup(newGroup)
	}

	useEffect(() => {
		const fetchGroup = async () => {
			const response = await fetch('/api/admin/get/groups/'+id)
			const data = await response.json()
			if (data.error) return alert(data.error)
			setGroup(data)
		}
		fetchGroup()
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
					{ Object.entries(group).map((entry, index)=>{
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
					<button onClick={updateGroup} className="action-button">Save</button>
					<button onClick={deleteGroup} className="action-button action-delete">Delete</button>
				</div>
			</div>
		</>
	)
}

export default GroupPage