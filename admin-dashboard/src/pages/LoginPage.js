import { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import "./LoginPage.css"

function LoginPage() {

	const [state, setState] = useState({ email: '', password: '' })
	const { login } = useContext(AuthContext)

	const onFormSubmit = async event => {
		event.preventDefault()
		const response = await fetch('/api/admin/login', {
			method: "post",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(state)
		})
		const data = await response.json()
		if (data.error) {
			return alert(data.error)
		}
		localStorage.setItem('token', data.token)
		login({ token: data.token })
	}

	const onInputChange = (key, value) => {
		const newState = { ...state }
		newState[key] = value
		setState(newState)
	}

	return (
		<div className="login-page-container">
			<section className="vh-100">
				<div className="container-fluid h-custom">
					<div className="row d-flex justify-content-center align-items-center h-100">
						<div className="col-md-9 col-lg-6 col-xl-5">
							<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
								className="img-fluid" alt="Sample image" />
						</div>
						<div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
							<form onSubmit={onFormSubmit}>
								<div className="form-outline mb-4">
									<label className="form-label" htmlFor="form3Example3">Email address</label>
									<input type="email" id="email" className="form-control form-control-lg" name='email' value={state.email} onChange={event => onInputChange('email', event.target.value)}
										placeholder="Enter a valid email address" />
								</div>

								<div className="form-outline mb-3">
									<label className="form-label" htmlFor="form3Example4">Password</label>
									<input type="password" id="password" className="form-control form-control-lg" name='password' value={state.password} onChange={event => onInputChange('password', event.target.value)}
										placeholder="Enter password" />
								</div>


								<div className="text-center text-lg-start mt-4 pt-2">
									<button type="submit" className="btn btn-primary btn-lg"
										style={{ "paddingLeft": "2.5rem", "paddingRight": "2.5rem" }}>Login</button>
								</div>

							</form>
						</div>
					</div>
				</div>
				<div
					className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
					<div className="text-white mb-3 mb-md-0">
						Copyright © 2022. All rights reserved.
					</div>

					<div>
						<a href="#!" className="text-white me-4">
							<i className="fab fa-facebook-f"></i>
						</a>
						<a href="#!" className="text-white me-4">
							<i className="fab fa-twitter"></i>
						</a>
						<a href="#!" className="text-white me-4">
							<i className="fab fa-google"></i>
						</a>
						<a href="#!" className="text-white">
							<i className="fab fa-linkedin-in"></i>
						</a>
					</div>
				</div>
			</section>
		</div>
	)
}

export default LoginPage