import React, {useState, useEffect} from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';

const Navbar = ({ isLoggedIn, onSignOut, projectId }) => {
	console.log("getting name")

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

  return (
    <div>
      <AppBar position="fixed" sx={{
          backgroundColor: '#3c88bf',
          padding: '8px 16px',
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
            {/* ScrumMate Text when clicked, links to dashboard */}
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
