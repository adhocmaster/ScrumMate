import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemText, Paper } from '@mui/material';
import { PieChart } from '@mui/icons-material';
import Navbar from '../Components/Navbar';
import ScrollBox from '../Components/ScrollBox';


const drawerWidth = 240;

const Dashboard = ({ isLoggedIn }) => {
  // Functionality for navigation clicks will need to be implemented
  const handleNavClick = (page) => {
    // Logic to handle navigation
    console.log(`Navigate to ${page}`);
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
          Dashboard
        </h1>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around', // This will space out the child divs equally
        alignItems: 'flex-start', // This aligns items to the start of the cross axis
        width: '100%', // Set the width to 100% of the parent or adjust as needed
        // Add additional styling as needed
      }}>
          <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'blue',
          //border: '5px solid yellow',
          borderRadius: '10px',
          marginRight: '100px',
          marginLeft: '25px',
          padding: '20px',
          width: '300px', // Adjust width as necessary
          height: '600px', // Adjust height as necessary
          color: 'white',
          textAlign: 'center'
        }}>
          <h1>Current Projects</h1>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li>Scrum Management Tool</li>
            <li>Project 2</li>
            <li>Project 3</li>
            <li>Project 4</li>
            <li>Project 4</li>
          </ul>
          <button style={{
            backgroundColor: 'navy',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer'
          }}>
            Create New Project
          </button>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: 'blue',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            fontFamily: 'sans-serif',
            width: '1000px',
            height: '600px',
            marginRight: '25px'
          }}>
            <div style={{ flex: 3 }}>
              <h1>Project 2</h1>
              <h2>Project 2 Overview:</h2>
              <h3>Sprint 1 Story Point Completion:</h3>
              <div>
                <h4>Completed Tasks:</h4>
                <p>User Story 1:</p>
                <ul>
                  <li>Task 1 (X story points)</li>
                  <li>Task 2 (X story points)</li>
                  <li>Task 3 (X story points)</li>
                </ul>
                <p>User Story 2:</p>
                <ul>
                  <li>Task 2 (X story points)</li>
                </ul>
                <p>User Story 3:</p>
                <ul>
                  <li>Task 3 (X story points)</li>
                </ul>
                <h4>Tasks to do:</h4>
                <p>User Story 2:</p>
                <ul>
                  <li>Task 1 (X story points)</li>
                  <li>Task 3 (X story points)</li>
                </ul>
              </div>
            </div>
            <div style={{ flex: 2, textAlign: 'center' }}>
              <div style={{
                backgroundColor: 'white',
                color: 'black',
                padding: '20px',
                height: '200px', // Adjust as needed
                width: '200px', // Adjust as needed
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}>
                <p>Pie Graph of</p>
                <p>Completed Tasks vs</p>
                <p>Incomplete</p>
              </div>
              <button style={{
                backgroundColor: 'navy',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                marginTop: '20px',
                cursor: 'pointer',
              }}>
                View Release Plan
              </button>
            </div>
          </div>
      </div>

      

    </>
  );
};

export default Dashboard;

