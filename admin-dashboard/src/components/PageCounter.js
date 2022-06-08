import { Link } from 'react-router-dom'

function PageCounter({ current, from, to, url }) {
	
	if (from === to) {
		return ""
	}

	return (
		<div className="page-counter-container">
			{ current!==from && <Link to={`${url}?page=${current-1}`}>Previous</Link> }
			{current}
			{ current!==to && <Link to={`${url}?page=${current+1}`}>Next</Link> }
		</div>
	)
}

export default PageCounter