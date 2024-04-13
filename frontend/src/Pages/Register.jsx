import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

function Register({ onLogin }) {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleConfirmPasswordChange = (event) => {
		setConfirmPassword(event.target.value);
	};

	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			const response = await fetch('http://localhost:8080/api/user/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, email, password }),
			});

			if (response.ok) {
				// Handle successful Register
				// For example, log the user in and redirect to dashboard
				navigate('/dashboard');
			} else {
				// Handle errors (e.g., user already exists, validation error)
			}
		} catch (error) {
			// Handle network or other errors
		}
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
					minHeight: '600px',
					bgcolor: '#f3f3f3',
					p: 3, // padding inside the box
					borderRadius: '4px', // box corner curvature
					boxShadow: 15,
					border: 1,
					borderColor: 'gray',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 2,
					'& .MuiTextField-root': {
						width: '80%',
						'& label': { color: 'gray' },
						'& .MuiOutlinedInput-root': {
							color: 'black',
							'& fieldset': {
								borderColor: 'gray',
								borderWidth: 2,
								borderRadius: 1
							},
							'&:hover fieldset': {
								borderColor: 'black',
							},
							'&.Mui-focused fieldset': {
								borderColor: 'black',
							},

						},
					},
				}}
				component="form"
				onSubmit={handleSubmit}
			>
				<Typography
					sx={{
						typography: 'h5',
						color: 'black',
						textAlign: 'center',
						fontSize: '34px'
					}}
				>
					Create an account
				</Typography>

				<AccountBoxIcon
					fontSize='large'
					sx={{
						fontSize: '120px', // Additional size adjustment
						color: 'gray', // Optional: Change icon color
					}}
				/>

				<TextField
					required='true'
					error // just for red asterisk
					label="Username"
					variant="outlined"
					autoComplete="off"
					value={username}
					onChange={handleUsernameChange}
				/>

				<TextField
					required='true'
					error // just for red asterisk
					label="Email"
					variant="outlined"
					autoComplete="off"
					value={email}
					onChange={handleEmailChange}
				/>

				<TextField
					required='true'
					error // just for red asterisk
					label="Password"
					type="password"
					variant="outlined"
					autoComplete="new-password"
					value={password}
					onChange={handlePasswordChange}
				/>

				<TextField
					required='true'
					error // just for red asterisk
					label="Confirm Password"
					type="password"
					variant="outlined"
					autoComplete="new-password"
					value={confirmPassword}
					onChange={handleConfirmPasswordChange}
				/>

				<Button
					type="submit"
					variant="contained"
					onClick={handleSubmit}
					sx={{
						mt: 0,
						bgcolor: '#0a81ff',
						color: 'white',
						fontSize: '18px',
						'&:hover': {
							bgcolor: 'white',
							color: '#0a81ff',
						},
					}}
				>
					Sign up
				</Button>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						width: '80%',
						justifyContent: 'center',
						marginTop: '1rem', // Adjust the marginTop as needed
					}}
				>
					<Typography sx={{ color: 'black', textAlign: 'center', fontSize: '18px' }}>
						Already have an account?
						<Link
							href="/"
							sx={{ color: 'blue', textDecoration: 'none', marginLeft: '0.2rem' }}
						>
							Sign in
						</Link>
					</Typography>
				</Box>


			</Box>
		</Box>
	);
}

export default Register;

// const Register = () => {
// 	return (
// 		<Container maxWidth="sm">
// 			<Typography variant="h4" sx={{ marginY: 4 }}>Register</Typography>
// 			<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
// 				<TextField
// 					margin="normal"
// 					required
// 					fullWidth
// 					label="Username"
// 					name="username"
// 					autoComplete="username"
// 					autoFocus
// 					value={username}
// 					onChange={(e) => setUsername(e.target.value)}
// 				/>
// 				<TextField
// 					margin="normal"
// 					required
// 					fullWidth
// 					label="Email Address"
// 					name="email"
// 					autoComplete="email"
// 					value={email}
// 					onChange={(e) => setEmail(e.target.value)}
// 				/>
// 				<TextField
// 					margin="normal"
// 					required
// 					fullWidth
// 					name="password"
// 					label="Password"
// 					type="password"
// 					autoComplete="current-password"
// 					value={password}
// 					onChange={(e) => setPassword(e.target.value)}
// 				/>
// 				<TextField
// 					margin="normal"
// 					required
// 					fullWidth
// 					name="confirmPassword"
// 					label="Confirm Password"
// 					type="password"
// 					autoComplete="current-password"
// 					value={confirmPassword}
// 					onChange={(e) => setConfirmPassword(e.target.value)}
// 				/>
// 				<Button
// 					type="submit"
// 					fullWidth
// 					variant="contained"
// 					sx={{ mt: 3, mb: 2 }}
// 				>
// 					Register
// 				</Button>
// 			</Box>
// 		</Container>
// 	);
// };
