import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import { useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Alert from '@mui/material/Alert';

function Register() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [invalidUsernameAlert, setInvalidUsernameAlert] = useState(false);
	const [invalidEmailAlert, setInvalidEmailAlert] = useState(false);
	const [usernameOrEmailTakenAlert, setUsernameOrEmailTakenAlert] = useState(false);
	const [passwordMissingAlert, setPasswordMissingAlert] = useState(false);
	const [passwordMismatchAlert, setPasswordMismatchAlert] = useState(false);

	const validateEmail = (email) => {
		// https://mailtrap.io/blog/react-native-email-validation/
		// eslint-disable-next-line no-control-regex
		const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
		return expression.test(String(email).toLowerCase())
	}

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
		var flag = false;
		if (!validateEmail(email)) {
			setInvalidEmailAlert(true);
			flag = true;
		}
		if (username === "") {
			setInvalidUsernameAlert(true);
			flag = true;
		}
		if (password === "" || confirmPassword === "") {
			setPasswordMissingAlert(true);
			flag = true;
		}
		if (password !== confirmPassword) {
			setPasswordMismatchAlert(true);
			flag = true;
		}
		if (flag) {
			return;
		}

		try {
			const response = await fetch('http://localhost:8080/api/user/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, email, password }),
			});

			if (response.status === 200) {
				navigate('/dashboard');
			} else {
				setUsernameOrEmailTakenAlert(true);
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

				<>
					<AccountBoxIcon
						fontSize='large'
						sx={{
							fontSize: '120px', // Additional size adjustment
							color: 'gray', // Optional: Change icon color
						}}
					/>
					{usernameOrEmailTakenAlert &&
						<Alert severity="error" onClose={() => setUsernameOrEmailTakenAlert(false)} >
							Username or Email is already in use
						</Alert>
					}
					{invalidUsernameAlert &&
						<Alert severity="error" onClose={() => setInvalidUsernameAlert(false)} >
							Invalid username
						</Alert>
					}
					{invalidEmailAlert &&
						<Alert severity="error" onClose={() => setInvalidEmailAlert(false)} >
							Invalid Email
						</Alert>
					}
					{passwordMissingAlert &&
						<Alert severity="error" onClose={() => setPasswordMissingAlert(false)} >
							Passwords is missing
						</Alert>
					}
					{passwordMismatchAlert &&
						<Alert severity="error" onClose={() => setPasswordMismatchAlert(false)} >
							Passwords do not match
						</Alert>
					}
				</>

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
