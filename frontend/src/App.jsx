import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Navbar from './Components/Navbar';
import TextBox from './Components/Textbox';
import DualScrollBoxes from './Components/DualScrollBoxes';
import './App.css';

function App() {
  const [data, setData] = useState(null);
  const [textBoxText, setTextBoxText] = useState("Dashboard");
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    fetch('/')
      .then((res) => res.json())
      .then((data) => {
        setData(data.message);
        setTextBoxText(data.message);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Change page on navbar click
  const handleNavClick = (page) => {
    setCurrentPage(page);
    let pageText = "";
    switch (page) {
      case 'home':
        pageText = "Dashboard";
        break;
      case 'releasePlan':
        pageText = "Release Plan";
        break;
      case 'sprints':
        pageText = "Sprints";
        break;
      default:
        pageText = "";
    }
    setTextBoxText(pageText);
  };

  // Handle buttons
  const handleCreateNewProject = () => {
    console.log('Create new project button clicked');
  };

  const handleCreateReleasePlan = () => {
    console.log('Create release plan button clicked');
  };

  const handlePlanningPoker = () => {
    console.log('Planning poker button clicked');
  };

  const handleEndOfSprintReport = () => {
    console.log('End of sprint report button clicked');
  };

  let content;
  const buttonShadow = '3px 5px 10px rgba(0, 0, 0, 0.7)'; // Button shadow effect
  // Change page content
  if (currentPage === 'home') {
    content = (
      <>
        <TextBox text={textBoxText} />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateNewProject}
          style={{
            position: 'absolute',
            top: '140px', 
            right: '45px', 
            boxShadow: buttonShadow
          }}
        >
          Create New Project
        </Button>
        <DualScrollBoxes />
      </>
    );
  } else if (currentPage === 'releasePlan') {
    content = (
      <>
        <TextBox text={textBoxText} />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateReleasePlan}
          style={{
            position: 'absolute',
            top: '140px', 
            right: '45px', 
            boxShadow: buttonShadow 
            
          }}
        >
          Create Release Plan
        </Button>
        <DualScrollBoxes />
      </>
    );
  } else if (currentPage === 'sprints') {
    content = (
      <>
        <TextBox text={textBoxText} />
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handlePlanningPoker}
          style={{
            position: 'absolute',
            top: '140px', 
            right: '250px', 
            boxShadow: buttonShadow 
          }}
        >
          Planning Poker
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleEndOfSprintReport}
          style={{
            position: 'absolute',
            top: '140px', 
            right: '45px', 
            boxShadow: buttonShadow 
          }}
        >
          End of Sprint Report
        </Button>
        <DualScrollBoxes />
      </>
    );
  }

  return (
    <div className="App">
      <Navbar onNavClick={handleNavClick} />
      {content}
    </div>
  );
}

export default App;
