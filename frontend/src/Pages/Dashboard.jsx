import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemText, Paper } from '@mui/material';
import { PieChart } from '@mui/icons-material';
import Navbar from '../Components/Navbar';


const drawerWidth = 240;

const Dashboard = ({ isLoggedIn }) => {
  // Functionality for navigation clicks will need to be implemented
  const handleNavClick = (page) => {
    // Logic to handle navigation
    console.log(`Navigate to ${page}`);
  };

  return (
    <>
      <Box display="flex">
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              marginTop: '150px',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Typography variant="h6" sx={{ padding: 2 }}>
            Dashboard
          </Typography>
          <List>
            {['Scrum Management Tool', 'Project 2', 'Project 3', 'Project 4'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Button sx={{ margin: 2 }} variant="contained" color="primary">
            Create New Project
          </Button>
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', padding: 3, marginTop: '50px' }}
        >
          <Typography variant="h5" gutterBottom>
            Project 2
          </Typography>
          {/* Insert additional layout here similar to the example provided */}
          <Paper sx={{ padding: 2, margin: '10px 0' }}>
            {/* This is where you'd render your charts and other content */}
            <PieChart />
            <Typography variant="body1">
              Pie Graph of Completed Tasks vs Incomplete
            </Typography>
          </Paper>
          <Button variant="contained" color="secondary">
            View Release Plan
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;

