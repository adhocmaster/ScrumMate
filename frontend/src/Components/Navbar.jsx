import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onSignOut }) => {
  const textOutline = `
    -1px -1px 0 #000, 
    1px -1px 0 #000, 
    -1px 1px 0 #000, 
    1px 1px 0 #000`; 

  return (
    <div>
      <AppBar position="absolute" sx={{
          backgroundColor: '#332F52',
          padding: '8px 16px',
          boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.7)'
        }}>
        <Toolbar disableGutters sx={{ justifyContent: 'flex-start', alignItems: 'center' }}>
          {/* Home Button */}
          {isLoggedIn && <Button
            component={Link}
            to="/"
            sx={{
              fontFamily: 'Roboto',
              fontWeight: 600,
              backgroundColor: 'white',
              color: '#332F52', 
              marginRight: '20px',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#FFF1A6',
              },
            }}
          >
            Home
          </Button>
          }
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
            {/* ScrumMate Logo */}
            <Link to="/" style={{ fontFamily: 'DM Serif Display', textDecoration: 'none', color: '#FFF1A6' }}>ScrumMate</Link>
          </Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          {/* <Typography
            variant="h1"
            sx={{
              color: 'white',
              fontSize: '18px',
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
          > */}
            {/* Projects link */}
            {/* <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>Projects</Link>
          </Typography> */}
          </Box>
          {/* Sign In/Out Button */}
          <Button
            onClick={isLoggedIn ? onSignOut : null}
            sx={{
              backgroundColor: 'white',
              fontFamily: 'Roboto',
              fontWeight: 600,
              color: '#332F52', 
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#FFF1A6',
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
