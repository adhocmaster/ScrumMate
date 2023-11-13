import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import Navbar from './Components/Navbar';
import TextBox from './Components/Textbox';
import DualScrollBoxes from './Components/DualScrollBoxes';
import './App.css';
import SignInBox from './Components/SignInBox';

function App() {
  const [data, setData] = useState(null);
  const [textBoxText, setTextBoxText] = useState("Dashboard");
  const [currentPage, setCurrentPage] = useState('home');
  const [textBoxPadding, setTextBoxPadding] = useState('130px'); // State to track text box padding

  useEffect(() => {
    fetch('/')
      .then((res) => res.json())
      .then((data) => {
        setData(data.message);
        setTextBoxText(data.message);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Change page and padding on navbar click
  const handleNavClick = (page) => {
    setCurrentPage(page);
    let pageText = "";
    let paddingValue = '130px'; // Default padding
    switch (page) {
      case 'home':
        pageText = "Dashboard";
        paddingValue = '130px';
        break;
      case 'releasePlan':
        pageText = "Release Plan";
        paddingValue = '120px';
        break;
      case 'sprints':
        pageText = "Sprints";
        paddingValue = '153px';
        break;
      case 'signIn':
        pageText = ""
        paddingValue = '150';
        break;
      default:
        pageText = "Dashboard";
        paddingValue = '130px';
    }
    setTextBoxText(pageText);
    setTextBoxPadding(paddingValue); // Update the padding
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
        <TextBox text={textBoxText} style={{ paddingLeft: textBoxPadding }} />
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
        <TextBox text={textBoxText} style={{ paddingLeft: textBoxPadding }} />
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
        <TextBox text={textBoxText} style={{ paddingLeft: textBoxPadding }} />
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
  } else if (currentPage === 'signIn') {
    content = (
      <>
        <TextBox text={textBoxText} style={{ paddingLeft: textBoxPadding }} />
        <SignInBox />
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
