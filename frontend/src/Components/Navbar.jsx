import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';

const Navbar = ({ isLoggedIn, onSignOut }) => {

  // const textOutline = `
  //   -1px -1px 0 #000, 
  //   1px -1px 0 #000, 
  //   -1px 1px 0 #000, 
  //   1px 1px 0 #000`; 

  return (
    <div>
      <AppBar position="absolute" sx={{
          backgroundColor: '#3c88bf',
          padding: '8px 16px',
          // boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.7)'
        }}>
        <Toolbar 
          disableGutters 
          sx={{ 
            justifyContent: 'flex-start', 
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: '24px',
              marginRight: '30px',
            }}
          >
            {/* ScrumMate Logo */}
            <Link exact to="/" style={{ textDecoration: 'none', color: 'white' }}>ScrumMate</Link>
          </Typography>

          {/* Avatar Button */}
          {isLoggedIn && 
            <IconButton
              sx={{
                transform: 'scale(1.5)',
                marginLeft: 'auto' 
              }}
              // TODO: Add click functionality
              onClick={() => console.log('Clicked Avatar Icon')}
            >
              <AccountCircleIcon />
            </IconButton>
        }
        </Toolbar>
      </AppBar>
      {/* <Outlet/> */}
    </div>
  );
};

export default Navbar;
