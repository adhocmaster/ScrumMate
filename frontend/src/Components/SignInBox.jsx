import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';

function SignInBox() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // Align to the top
        alignItems: 'center',
        height: '100vh', // Full viewport height
        width: '100%',
        padding: '20px 0', // Added padding to the top and bottom
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '800px', // Increased maximum width
          height: '250px', // Increased height for the box
          bgcolor: 'rgb(34, 19, 170)', // Blue background color
          color: 'white',
          mt: '50px', // Push box down from the top of the screen
          p: 3,
          borderRadius: '10px',
          boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          '& .MuiTextField-root': {
            width: '100%', // Full width
            '& label.Mui-focused': {
              color: 'white',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
              // Override autofill styles
              '& input:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 100px rgb(34, 19, 170) inset', // Match the blue background color
                WebkitTextFillColor: 'white', // Keep the text color white
              },
              '& input:-webkit-autofill:hover': {
                WebkitBoxShadow: '0 0 0 100px rgb(34, 19, 170) inset',
                WebkitTextFillColor: 'white',
              },
              '& input:-webkit-autofill:focus': {
                WebkitBoxShadow: '0 0 0 100px rgb(34, 19, 170) inset',
                WebkitTextFillColor: 'white',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input': {
              color: 'white',
            },
            '& .MuiOutlinedInput-input': {
              color: 'white',
            },
          },
        }}
      >
        <Typography
          sx={{
            typography: 'h5',
            color: 'white',
            textAlign: 'center',
            textShadow: '1px 1px black, -1px -1px black, 1px -1px black, -1px 1px black',
          }}
        >
          Sign In
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          autoComplete="off"
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          autoComplete="new-password"
        />
        <Typography sx={{ color: 'white', textAlign: 'center', mt: 2 }}>
          <Link
            href="#" // Replace with your registration page link
            onClick={() => window.open('/register', '_blank')}
            sx={{ color: 'white', textDecoration: 'none' }}
          >
            Create a new account
          </Link>
          {' | '}
          <Link
            href="#" // Replace with your password reset page link
            onClick={() => window.open('/forgot-password', '_blank')}
            sx={{ color: 'white', textDecoration: 'none' }}
          >
            Forgot Password
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}

export default SignInBox;
