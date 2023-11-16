import React, { useState } from 'react';
import { Button } from '@mui/material';
import Navbar from './Components/Navbar';
import TextBox from './Components/Textbox';
import DualScrollBoxes from './Components/DualScrollBoxes';
import SignInBox from './Components/SignInBox';
import './App.css';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import ReleasePlan from './Pages/ReleasePlan'
import Dashboard from './Pages/Dashboard'
import SprintPlan from './Pages/SprintPage'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('signIn');

  const handleNavClick = (page) => {
    // Check if the user is trying to navigate to a restricted page while not logged in
    const restrictedPages = ['home', 'releasePlan', 'sprints'];
    if (!isLoggedIn && restrictedPages.includes(page)) {
      // If not logged in and trying to access a restricted page,
      // redirect to the signIn page
      setCurrentPage('signIn');
    } else if (page === 'signOut') {
      // Handle sign-out action
      setIsLoggedIn(false);
      setCurrentPage('signIn');
    } else {
      // If logged in, or navigating to signIn, allow to navigate
      setCurrentPage(page);
    }
  };

  const handleSignIn = (email, password) => {
    if (email === 'test@email.com' && password === 'password123') {
      setIsLoggedIn(true);
      setCurrentPage('home');
    } else {
      alert('Incorrect email or password.');
    }
  };

  // let content;
  // switch (currentPage) {
  //   case 'home':
  //     content = (
  //       <>
  //         <TextBox text="Dashboard" style={{ paddingLeft: '130px' }} />
  //         <Button variant="contained" color="primary" onClick={() => console.log('Create new project button clicked')} style={{ position: 'absolute', top: '140px', right: '45px', boxShadow: '3px 5px 10px rgba(0, 0, 0, 0.7)' }}>
  //           Create New Project
  //         </Button>
  //         <DualScrollBoxes />
  //       </>
  //     );
  //     break;
  //   case 'releasePlan':
  //     content = (
  //       <>
  //         <TextBox text="Release Plan" style={{ paddingLeft: '120px' }} />
  //         <Button variant="contained" color="primary" onClick={() => console.log('Create release plan button clicked')} style={{ position: 'absolute', top: '140px', right: '45px', boxShadow: '3px 5px 10px rgba(0, 0, 0, 0.7)' }}>
  //           Create Release Plan
  //         </Button>
  //         <DualScrollBoxes />
  //       </>
  //     );
  //     break;
  //   case 'sprints':
  //     content = (
  //       <>
  //         <TextBox text="Sprints" style={{ paddingLeft: '153px' }} />
  //         <Button variant="contained" color="primary" onClick={() => console.log('Planning poker button clicked')} style={{ position: 'absolute', top: '140px', right: '250px', boxShadow: '3px 5px 10px rgba(0, 0, 0, 0.7)' }}>
  //           Planning Poker
  //         </Button>
  //         <Button variant="contained" color="primary" onClick={() => console.log('End of sprint report button clicked')} style={{ position: 'absolute', top: '140px', right: '45px', boxShadow: '3px 5px 10px rgba(0, 0, 0, 0.7)' }}>
  //           End of Sprint Report
  //         </Button>
  //         <DualScrollBoxes />
  //       </>
  //     );
  //     break;
  //   case 'signIn':
  //   default:
  //     content = !isLoggedIn ? (
  //       <SignInBox onLogin={handleSignIn} />
  //     ) : (
  //       // Redirect to home page if logged in
  //       <>
  //         <TextBox text="Dashboard" style={{ paddingLeft: '130px' }} />
  //         <DualScrollBoxes />
  //       </>
  //     );
  //     break;
  // }

  return (
    <div className="App">
      {/* <Navbar onNavClick={handleNavClick} isLoggedIn={isLoggedIn} /> */}
      {/* {content} */}
      <Routes>
        <Route path="/" element={<Navbar onNavClick={handleNavClick} isLoggedIn = {isLoggedIn}/>}>
          <Route index element= {<SignInBox/>} />
          <Route path="home" element={<Dashboard />} />
          <Route path="releases" element={<ReleasePlan />} />
          <Route path = "sprints" element = {<SprintPlan/>} />
        </Route> 
      </Routes>
    </div>
  );
}

export default App;
