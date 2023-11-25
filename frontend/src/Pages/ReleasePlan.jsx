import React, { useState } from 'react';
import { AppBar, Typography, Button, Box, Paper } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import CreateReleasePlan from '../Components/CreateReleasePlan'; // Adjust the import path as necessary
import Navbar from '../Components/Navbar';

const ReleasePlan = () => {
  const [showCreateReleasePlan, setShowCreateReleasePlan] = useState(false);
  const [showReleasePlan, setShowReleasePlan] = useState(false);
  const [releasePlanText, setReleasePlanText] = useState('');

  const toggleCreateReleasePlan = () => {
    setShowCreateReleasePlan(!showCreateReleasePlan);
  };

  const toggleViewReleasePlan = () => {
    if (!showReleasePlan) {
      // Retrieve the saved release plan from localStorage if we're going to show it
      const savedReleasePlan = localStorage.getItem('releasePlanDocument');
      setReleasePlanText(savedReleasePlan || 'No release plan found.');
    }
    setShowReleasePlan(!showReleasePlan);
  };

  return (
    <>
    <div>
    <Navbar />
    </div>

    <div>
        <h1 style={{
          marginLeft: "25pt",
          color: 'yellow',
          textShadow: `
            -1px -1px 0 #000,  
            1px -1px 0 #000,
            -1px  1px 0 #000,
            1px  1px 0 #000`
        }}>
          Release Plan
        </h1>
    </div>

    {/* <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'blue',
      //border: '5px solid yellow',
      borderRadius: '10px',
      padding: '20px',
      width: '20vm', // Adjust width as necessary
      height: '70vh', // Adjust height as necessary
      color: 'white',
      textAlign: 'center',
      gap: '10px', // Adjust space between buttons as necessary
    }}>
      <button style={{
        backgroundColor: 'navy',
        color: 'white',
        border: '2px solid yellow',
        borderRadius: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}>
        Create Release Plan
      </button>
      <button style={{
        backgroundColor: 'navy',
        color: 'white',
        border: '2px solid yellow',
        borderRadius: '5px',
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
      }}>
        View Release Plan
      </button>
    </div> */}

    <div style={{
      backgroundColor: 'blue',
      color: 'white',
      padding: '2vw', // Use viewport width for responsive padding
      fontFamily: 'sans-serif',
      width: '80vw',
      height: '70vh',
      marginLeft: '10em'
    }}>
      <h2 style={{ borderBottom: '0.2vh solid yellow', paddingBottom: '1vw' }}>High level goals</h2>
      <div>
        <h3>Sprint 1:</h3>
        <ul style={{ listStyleType: 'none', paddingLeft: '1vw' }}>
          <li>User story 1 for sprint 1
            <ul>
              <li>Task for user story 1 (Completed)</li>
              <li>Task for user story 1 (Completed)</li>
              <li>Task for user story 1 (Completed)</li>
            </ul>
          </li>
          <li>User story 2 for sprint 1
            <ul>
              <li>Task for user story 2</li>
              <li>Task for user story 2 (Completed)</li>
            </ul>
          </li>
          <li>User story 3 for sprint 1
            <ul>
              <li>Task for user story 3</li>
              <li>Task for user story 3 (Completed)</li>
            </ul>
          </li>
        </ul>
      </div>
      <div>
        <h3>Sprint 2:</h3>
        <ul style={{ listStyleType: 'none', paddingLeft: '1vw' }}>
          <li>User story 1 for sprint 2
            <ul>
              <li>Task for user story 1</li>
              <li>Task for user story 1</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>



    </>
  );
};

export default ReleasePlan;
