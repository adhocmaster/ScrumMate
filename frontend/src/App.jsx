import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignInBox from './Components/SignIn/SignInBox';
import Dashboard from './Pages/Dashboard';
import ReleasePlan from './Pages/ReleasePlan';
import Navbar from './Components/common/Navbar';
import Register from './Pages/Register';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [color, setColor] = useState('#47a2c9')

	const handleSignIn = (email, password) => {
		try {
			var options = {
				url: "https://localhost:8080/api/user/login/",
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password }),
				credentials: 'include'
			}
			fetch('http://localhost:8080/api/user/login/', options).then((result) => {
				console.log(result)
				return result.json()

			}).then((response) => {
				console.log(response)
				setIsLoggedIn(true);
				setColor('#ffffff')
			})

		} catch (error) {
			console.log(error)
		}

	};


	const handleSignOut = () => {
		setIsLoggedIn(false);
	};


	return (
		<div className="App" style={{ backgroundColor: color }}>
			<Navbar isLoggedIn={isLoggedIn} onSignOut={handleSignOut} />
			<Routes>
				<Route
					path="/"
					element={
						isLoggedIn ? (
							<Navigate replace to="/dashboard" />
						) : (
							<SignInBox onLogin={handleSignIn} />
						)
					}
				/>
				<Route
					path="/dashboard"
					element={
						isLoggedIn ? <Dashboard /> : <Navigate replace to="/" />
					}
				/>
				<Route
					path="/releases"
					element={
						isLoggedIn ? <ReleasePlan /> : <Navigate replace to="/" />
					}
				/>

				<Route path="/register"
					element={
						<Register />
					} />
				{/* <Route path="/registrations" element={<Register />} /> */}
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</div>
	);
}

export default App;
