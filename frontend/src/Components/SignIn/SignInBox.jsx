import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';

function SignInBox({ setIsLoggedIn, setColor }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rememberMe, setRememberMe] = useState(false);
	const [errorAlert, setErrorAlert] = useState(false);

	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleRememberMeChange = (event) => {
		setRememberMe(event.target.checked);
	};

	const handleSignIn = async (email, password) => {
		try {
			var options = {
				url: "https://localhost:8080/api/user/login/",
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password }),
				credentials: 'include'
			}

			const response = await fetch('http://localhost:8080/api/user/login/', options);

			if (response.status === 200) {
				setIsLoggedIn(true);
				setColor('#ffffff')
				setPassword('')
			}
		} catch (error) {
			setErrorAlert(true)
		}
	};

	const handleEnterClick = (e) => {
		e.preventDefault();
		handleSignIn(email, password);
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
							'& input:-webkit-autofill': {
								WebkitBoxShadow: '0 0 0 100px #fcf8ca inset',
								WebkitTextFillColor: 'black',
								WebkitBackgroundClip: 'text',
								caretColor: 'black'
							},
							'& input:-webkit-autofill:hover': {
								WebkitBoxShadow: '0 0 0 100px #fcf8ca inset',
								WebkitTextFillColor: 'black',
								WebkitBackgroundClip: 'text',
								caretColor: 'black'
							},
							'& input:-webkit-autofill:focus': {
								WebkitBoxShadow: '0 0 0 100px #fcf8ca inset',
								WebkitTextFillColor: 'black',
								WebkitBackgroundClip: 'text',
								caretColor: 'black'
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
						fontSize: '34px'
					}}
				>
					Log in to your account
				</Typography>

				<>
					<AccountCircleIcon
						fontSize='large'
						sx={{
							fontSize: '120px', // Additional size adjustment
							color: 'gray', // Optional: Change icon color
						}}
					/>
					{errorAlert &&
						<Alert severity="error" onClose={() => setErrorAlert(false)} >
							Invalid username or password
						</Alert>
					}
				</>

				<TextField
					label="Email"
					variant="outlined"
					autoComplete="off"
					value={email}
					onChange={handleEmailChange}
				/>

				<TextField
					label="Password"
					type="password"
					variant="outlined"
					autoComplete="new-password"
					value={password}
					onChange={handlePasswordChange}
				/>

				<Box
					sx={{
						display: 'flex',
						alignItems: 'flex-start', // Align items to the top
						width: '90%',
						justifyContent: 'space-between',
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Checkbox
							checked={rememberMe}
							onChange={handleRememberMeChange}
						/>
						<Typography sx={{ ml: 0 }}>Remember me</Typography>
					</Box>

					<Typography sx={{ color: 'white', textAlign: 'center', mt: 1 }}>
						<Link
							href="#" // Replace with password reset page link
							onClick={() => window.open('/forgot-password', '_blank')}
							sx={{ color: 'blue', textDecoration: 'none' }}
						>
							Forgot Password
						</Link>
					</Typography>
				</Box>

				<Button
					type="submit"
					variant="contained"
					onClick={handleEnterClick}
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
					Sign in
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
						Don't have an account?
						<Link
							href="/register"
							sx={{ color: 'blue', textDecoration: 'none', marginLeft: '0.2rem' }}
						>
							Sign up
						</Link>
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

export default SignInBox;
