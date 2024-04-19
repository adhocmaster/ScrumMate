import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton } from '@mui/material';

const Navbar = ({ isLoggedIn, onSignOut, projectName, setName }) => {
	return (
		<div>
			<AppBar position="fixed" sx={{
				backgroundColor: '#0a81ff',
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
						onClick={() => setName('')}
					>
						{/* ScrumMate Text when clicked, links to dashboard */}
						<Link exact to="/" style={{ textDecoration: 'none', color: 'white' }}>ScrumMate</Link>
					</Typography>

					<Typography>
						{projectName}
					</Typography>

					{/* Avatar Button */}
					{isLoggedIn &&
						<IconButton
							sx={{
								transform: 'scale(1.5)',
								marginLeft: 'auto'
							}}
							// TODO: Add click functionality
							onClick={onSignOut}
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
