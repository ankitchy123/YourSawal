function PageHeader({title, total, current}) {
	return (
		<div className='page-header'>
			<h3>{title}</h3>
			<div className='header-stats-container'>
				<span className='stat-total-items'><b>Total Items:</b> {total}</span>
				<span className='stat-current-items'><b>Current Page:</b> {current}</span>
			</div>
			<hr />
		</div>
	)
}

export default PageHeader