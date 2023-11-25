// App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignInBox from './Components/SignInBox';
import Dashboard from './Pages/Dashboard';
import ReleasePlan from './Pages/ReleasePlan';
import SprintPlan from './Pages/SprintPage';
import Navbar from './Components/Navbar'; // Make sure the path is correct

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSignIn = (email, password) => {
    const hardcodedEmail = 'test@email.com';
    const hardcodedPassword = 'password123';

    if (email === hardcodedEmail && password === hardcodedPassword) {
      setIsLoggedIn(true);
    } else {
      alert('Incorrect email or password.');
    }
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
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
        <Route
          path="/sprints"
          element={
            isLoggedIn ? <SprintPlan /> : <Navigate replace to="/" />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
