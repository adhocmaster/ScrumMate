import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignInBox from './Components/SignIn/SignInBox';
import Dashboard from './Pages/Dashboard';
import ReleasePlan from './Pages/ReleasePlan';
import Navbar from './Components/common/Navbar';
import Register from './Pages/Register';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [color, setColor] = useState('#E6EEFF')

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
							<SignInBox setIsLoggedIn={setIsLoggedIn} setColor={setColor} />
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
