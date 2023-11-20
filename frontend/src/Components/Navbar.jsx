// Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onSignOut }) => {
  const textOutline = `
    -1px -1px 0 #000, 
    1px -1px 0 #000, 
    -1px 1px 0 #000, 
    1px 1px 0 #000`; // Black outline shadow

  return (
    <div>
      <AppBar position="static" sx={{
          backgroundColor: 'rgb(34, 19, 170)',
          padding: '8px 16px',
          boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.7)' // Navbar shadow
        }}>
        <Toolbar disableGutters sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              color: 'gold',
              fontSize: '24px',
              fontWeight: 'bold',
              marginRight: '30px',
              transition: 'color 0.3s ease',
              textShadow: textOutline, 
              '&:hover': {
                color: 'white',
                textShadow: 'none', 
              },
              cursor: 'pointer',
            }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'gold' }}>ScrumMate</Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <Link to="/releases" style={{ textDecoration: 'none', color: 'gold', marginRight: '16px' }}>
              Release Plan
            </Link>
            <Link to="/sprints" style={{ textDecoration: 'none', color: 'gold' }}>
              Sprints
            </Link>
          </Box>
          <Button
            onClick={isLoggedIn ? onSignOut : null}
            sx={{
              backgroundColor: '#007bff',
              color: 'white',
              '&:hover': {
                backgroundColor: '#7cbbff',
              },
              marginLeft: 'auto',
            }}
          >
            {isLoggedIn ? 'Sign Out' : 'Sign In'}
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet/>
    </div>
  );
};

export default Navbar;
