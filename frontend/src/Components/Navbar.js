import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'rgb(34, 19, 170)', padding: '0.5rem 1rem' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginRight: '1rem',
            transition: 'color 0.3s ease',
            '&:hover': {
              color: 'gold',
            },
            textDecoration: 'none',
          }}
          component="a"
          href="/"
        >
          ScrumMate
        </Typography>
        <Box sx={{ marginRight: 'auto', marginTop: '.4rem', display: 'flex' }}>
          <Typography
            component="a"
            href="/"
            sx={{
              color: 'white',
              marginLeft: '1rem',
              transition: 'color 0.3s ease',
              textDecoration: 'none',
              '&:hover': {
                color: 'gold',
              },
            }}
          >
            Release Plan
          </Typography>
          <Typography
            component="a"
            href="/about"
            sx={{
              color: 'white',
              marginLeft: '1rem',
              transition: 'color 0.3s ease',
              textDecoration: 'none',
              '&:hover': {
                color: 'gold',
              },
            }}
          >
            Sprints
          </Typography>
        </Box>
        <Button
          sx={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            '&:hover': {
              backgroundColor: '#7cbbff',
            },
          }}
        >
          Sign In
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
