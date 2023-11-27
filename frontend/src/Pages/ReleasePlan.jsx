import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"
import { AppBar, Typography, Button, Box, Paper } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import CreateReleasePlan from '../Components/CreateReleasePlan'; // Adjust the import path as necessary

const ReleasePlan = () => {
  const [showCreateReleasePlan, setShowCreateReleasePlan] = useState(false);
  const [showReleasePlan, setShowReleasePlan] = useState(false);
  const [releasePlanText, setReleasePlanText] = useState('');
  const location = useLocation()
  const project = location.state.currentProject
  console.log(project)
  const toggleCreateReleasePlan = () => {
    setShowCreateReleasePlan(!showCreateReleasePlan);
  };
  useEffect(()=>{
    // add fetch here

  },[])
  const toggleViewReleasePlan = () => {
    if (!showReleasePlan) {
      // Retrieve the saved release plan from localStorage if we're going to show it
      const savedReleasePlan = localStorage.getItem('releasePlanDocument');
      
      setReleasePlanText(savedReleasePlan || 'No release plan found.');
    }
    setShowReleasePlan(!showReleasePlan);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: 'navy', marginBottom: 4 }}>
        {/* AppBar content can go here */}
      </AppBar>

      <Box display="flex" justifyContent="center" p={2}>
        <Paper elevation={3} sx={{ width: '80%', padding: 2 }}>
          <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 2 }}>
            Release Plan
          </Typography>
          <Box display="flex" justifyContent="space-between" marginBottom={2}>
            <Button variant="contained" color="primary" onClick={toggleCreateReleasePlan}>
              {showCreateReleasePlan ? 'Hide Create Form' : 'Create Release Plan'}
            </Button>
            <Button variant="contained" color="primary" onClick={toggleViewReleasePlan}>
              {showReleasePlan ? 'Hide Release Plan' : 'View Release Plan'}
            </Button>
          </Box>

          {/* Conditionally render the CreateReleasePlan component */}
          {showCreateReleasePlan && <CreateReleasePlan projectId={project._id}/>}

          {/* Conditionally render the release plan text */}
          {showReleasePlan && (
            <Paper elevation={2} sx={{ backgroundColor: '#e0e0e0', padding: 2, marginTop: 2 }}>
              {/* Split the text into lines and apply different styles to the first line and the rest */}
              {releasePlanText.split('\n').map((line, index) => (
                <Typography
                  key={index}
                  variant="body1"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    textAlign: index === 0 ? 'center' : 'left' // Justify the first line, left-align the rest
                  }}
                >
                  {line}
                </Typography>
              ))}
            </Paper>
          )}

          <Paper elevation={2} sx={{ backgroundColor: '#f0f0f0', padding: 2 }}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Sprints
            </Typography>
            <List>
              <ListItem>
                <ListItemText primary="Sprint 1:" />
              </ListItem>
              <Typography variant="body1" component="div">
                User story 1 for sprint 1
                <List sx={{ marginLeft: 4 }}>
                  <ListItem>
                    <ListItemText primary="Task for user story 1 (Completed)" />
                  </ListItem>
                  {/* Repeat for other tasks */}
                </List>
              </Typography>
              {/* Repeat for other user stories and sprints */}
            </List>
          </Paper>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReleasePlan;
