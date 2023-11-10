import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = ({ onNavClick }) => {
  return (
    <AppBar position="static" sx={{
        backgroundColor: 'rgb(34, 19, 170)',
        padding: '8px 16px',
        boxShadow: '1px 5px 10px rgba(0, 0, 0, 0.7)' // Navbar shadow
      }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            color: 'gold',
            fontSize: '24px',
            fontWeight: 'bold',
            marginRight: '16px',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: 'white',
            },
            cursor: 'pointer',
          }}
          onClick={() => onNavClick('home')}
        >
          ScrumMate
        </Typography>
        <Box sx={{ marginRight: 'auto', marginTop: '6.4px', display: 'flex' }}>
          <Typography
            sx={{
              color: 'gold',
              marginLeft: '16px',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: 'white',
              },
              cursor: 'pointer',
            }}
            onClick={() => onNavClick('releasePlan')}
          >
            Release Plan
          </Typography>
          <Typography
            sx={{
              color: 'gold',
              marginLeft: '16px',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: 'white',
              },
              cursor: 'pointer',
            }}
            onClick={() => onNavClick('sprints')}
          >
            Sprints
          </Typography>
        </Box>
        <Button
          sx={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '16px',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            '&:hover': {
              backgroundColor: '#7cbbff',
            },
          }}
          onClick={() => onNavClick('signIn')}
        >
          Sign In
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
