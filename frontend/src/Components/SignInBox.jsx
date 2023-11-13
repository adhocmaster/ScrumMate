import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

function SignInBox({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEnterClick = () => {
    onLogin(email, password);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        padding: '20px 0',
      }}
    >
      <Box
        sx={{
          width: '90%',
          maxWidth: '800px',
          bgcolor: 'rgb(34, 19, 170)',
          color: 'white',
          mt: '-300px',
          p: 3,
          borderRadius: '10px',
          boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          '& .MuiTextField-root': {
            width: '100%', // Full width
            '& label': { color: 'white' },
            '& .MuiInput-underline:before': { borderBottomColor: 'white' },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'white' },
            '& .MuiInput-underline:after': { borderBottomColor: 'white' },
            '& .MuiOutlinedInput-root': {
              color: 'white', // Text color
              '& fieldset': {
                borderColor: 'white', // Border color
              },
              '&:hover fieldset': {
                borderColor: 'white', // Border color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white', // Border color when focused
              },
              // Override styles for autofilled inputs
              '& input:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 100px rgb(34, 19, 170) inset',
                WebkitTextFillColor: 'white',
                WebkitBackgroundClip: 'text',
                caretColor: 'white'
              },
              '& input:-webkit-autofill:hover': {
                WebkitBoxShadow: '0 0 0 100px rgb(34, 19, 170) inset',
                WebkitTextFillColor: 'white',
                WebkitBackgroundClip: 'text',
                caretColor: 'white'
              },
              '& input:-webkit-autofill:focus': {
                WebkitBoxShadow: '0 0 0 100px rgb(34, 19, 170) inset',
                WebkitTextFillColor: 'white',
                WebkitBackgroundClip: 'text',
                caretColor: 'white'
              },
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
          value={email}
          onChange={handleEmailChange}
          sx={{
            marginBottom: '20px', // Added space between the text fields
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          autoComplete="new-password"
          value={password}
          onChange={handlePasswordChange}
        />
        <Button
          variant="contained"
          onClick={handleEnterClick}
          sx={{
            mt: 2,
            bgcolor: 'white',
            color: 'rgb(34, 19, 170)',
            '&:hover': {
              bgcolor: 'white',
              color: 'rgb(34, 19, 170)',
            },
          }}
        >
          Enter
        </Button>
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
