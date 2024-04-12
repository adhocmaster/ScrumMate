import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function SignInBox({ onLogin }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleEnterClick = (e) => {
		e.preventDefault();
		onLogin(email, password)
	};

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-start',
				alignItems: 'center',
				height: 'calc(100vh - 60px)',
				paddingTop: '55px',
			}}
		>
			<Box
				sx={{
					minWidth: '400px',
					minHeight: '450px',
					bgcolor: '#f0f0f0',
					p: 3, // padding inside the box
					borderRadius: '4px', // box corner curvature
					boxShadow: 10,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 2,
					'& .MuiTextField-root': {
						width: '100%',
						'& label': { color: 'white' },
						'& .MuiInput-underline:before': { borderBottomColor: 'white' },
						'& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottomColor: 'white' },
						'& .MuiInput-underline:after': { borderBottomColor: 'white' },
						'& .MuiOutlinedInput-root': {
							color: 'white',
							'& fieldset': {
								borderColor: 'white',
							},
							'&:hover fieldset': {
								borderColor: 'white',
							},
							'&.Mui-focused fieldset': {
								borderColor: 'white',
							},
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
				component="form"
				onSubmit={handleEnterClick}
			>
				<Typography
					sx={{
						typography: 'h5',
						color: 'black',
						textAlign: 'center',
					}}
				>
					Log in to your account
				</Typography>

				<AccountCircleIcon
					fontSize='large'
					sx={{
						fontSize: '100px', // Additional size adjustment
						color: 'gray', // Optional: Change icon color
					}}
				/>

				<TextField
					label="Email"
					variant="outlined"
					autoComplete="off"
					value={email}
					onChange={handleEmailChange}
					sx={{
						marginBottom: '20px',
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
					type="submit"
					variant="contained"
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
						href="/register"
						// onClick={() => window.open('/register', '_blank')} 
						sx={{ color: 'white', textDecoration: 'none' }}
					>
						Create a new account
					</Link>
					{' | '}
					<Link
						href="#" // Replace with password reset page link
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
