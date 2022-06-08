import "../styles/Table.css"

function Table({ children }) {
	return (
		<table className="table-container">
			<tbody>{children}</tbody>
		</table>
	)
}

export default Table