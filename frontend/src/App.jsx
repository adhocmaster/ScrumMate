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
  const [userId,setUserID] = useState("")
  const handleSignIn = (email, password) => {
    // const hardcodedEmail = 'test@email.com';
    // const hardcodedPassword = 'password123';

    // if (email === hardcodedEmail && password === hardcodedPassword) {
    // } else {
    //   alert('Incorrect email or password.');
    // }
    try{ 
      var options = {
        url:"https://localhost:3001/auth/login/",
        method:'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({email,password})
      }
      fetch('http://localhost:3001/auth/login/',options).then((result)=>{
        if(result.status == 200){
          
        }
        return result.json()

      }).then((response)=>{
        console.log(response)
        setUserID(response._id)
        setIsLoggedIn(true);

      })

    }catch(error){
      console.log(error)
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
              <Navigate replace to="/dashboard" userId ={userId} />
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
