import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton, Box } from '@mui/material';
import scrumChampionImage from '../../Images/scrum_champion_helmet.png';

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
							marginTop: '6px'
						}}
						onClick={() => setName('')}
					>
						{/* ScrumMate Text when clicked, links to dashboard */}
						<Link exact to="/" style={{ textDecoration: 'none', color: 'white' }}>
							<Box display="flex" alignItems="center">
								<img src={scrumChampionImage} alt="Image" style={{ width: '50px', height: 'auto', paddingBottom: '10px' }} />
								<Typography variant="h6" sx={{ marginRight: 2 }}>
									Scrum Champion
								</Typography>
							</Box>
						</Link>
					</Typography>

					<Typography sx={{
						marginTop: '6px'
					}}>
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
