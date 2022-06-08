function TableCell({ children, head }) {
	return head ?
	<th className="table-data table-head">{children}</th>
	: <td className="table-data">{children}</td>
}

export default TableCell