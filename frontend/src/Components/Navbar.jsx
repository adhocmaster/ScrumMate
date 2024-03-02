import React, {useState, useEffect} from 'react';
import { BrowserRouter as useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';

const Navbar = ({ isLoggedIn, onSignOut, projectId }) => {

  const [name, setName] = useState('');

  useEffect(() => {

    var options = {
      method: 'get',
      credentials:'include'
    }
    fetch(`https://localhost:8080/project/${projectId}/getName`)
    .then (response => response.json())
    .then(data => {
      console.log(data)
      setName(data);
    })
    .catch(error => {
      console.error('Error', error);
    });
  }, []);

  // const textOutline = `
  //   -1px -1px 0 #000, 
  //   1px -1px 0 #000, 
  //   -1px 1px 0 #000, 
  //   1px 1px 0 #000`; 

  return (
    <div>
      <AppBar position="fixed" sx={{
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

              <Typography>
                {name}
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
