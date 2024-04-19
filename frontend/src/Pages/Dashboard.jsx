import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ButtonBar from '../Components/ReleasePlan/ButtonBar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState, useEffect } from 'react';

export default function Dashboard({ setName }) {
	const [rows, setRows] = useState([]);

	function fetchProjectRowData() {
		var options = {
			method: 'get',
			credentials: 'include'
		}
		try {
			fetch(`http://localhost:8080/api/user/projectRowData`, options).then((result) => {
				if (result.status === 200) {
					console.log(result)
				}
				console.log('waiting for .then')
				result.json().then((response) => {
					setRows(response)
					// setRevisions(response.releases.map((release) => convertRevisionAndDate(release)))
				})
			})
		} catch {
			return null;
		}
	}

	useEffect(() => {
		fetchProjectRowData();
	}, []);

	function Row(projectData) {
		const [open, setOpen] = useState(false);
		const data = projectData.row
		// https://forum.freecodecamp.org/t/how-to-convert-date-to-dd-mm-yyyy-in-react/431093
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		const formattedDate = new Date(data.dateCreated).toLocaleDateString('en-US', options);


		return (
			<React.Fragment>
				<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
					<TableCell component="th" scope="row">
						<Button
							component={Link}
							to="/releases"
							style={{ textTransform: 'none' }}
							state={{ data }}
							onClick={() => { setName(data.name) }}
						>
							{data.name}
						</Button>
					</TableCell>
					<TableCell align="right">{data.productOwner.username}</TableCell>
					<TableCell align="right">{data.nextRevision}</TableCell>
					{/* <TableCell align="right">{data.currentSprint}</TableCell> */}
					<TableCell align="right">{'-'}</TableCell>
					<TableCell align="right">{formattedDate}</TableCell>
					<TableCell align="right">
						<IconButton
							aria-label="expand row"
							size="small"
							onClick={() => setOpen(!open)}
						>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box sx={{ margin: 1 }}>
								<Typography variant="h6" gutterBottom component="div">
									Shortcuts
								</Typography>
								<Box
									display="flex"
									justifyContent={'flex-start'}
								>
									{/* TODO: Handle Button Clicks */}
									<ButtonBar />
								</Box>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			</ React.Fragment >
		);
	}

	return (
		<>
			<Box sx={{
				display: 'flex',
				paddingLeft: '20px',
				paddingBottom: '20px',
				paddingTop: '55px'
			}}>
				<Typography
					variant="h4"
					align='left'
					sx={{ flexGrow: 0 }}
				>
					My Projects
				</Typography>
				<IconButton
					onClick={() => {
						console.log("adding item");
					}}
				>
					<AddCircleOutlineIcon fontSize="small" />
				</IconButton>
			</Box>

			<TableContainer component={Paper} sx={{ width: '90%', margin: 'auto' }}>
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<TableCell>
								<Typography variant="h5">
									Project Name
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="h5">
									Owner
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="h5">
									Revision Number
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="h5">
									Current Sprint
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="h5">
									Date Created
								</Typography>
							</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<Row key={row.id} row={row} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}

// import React, { useState, useEffect } from 'react';
// import { Typography, Button, Box, Drawer, List, ListItem, ListItemText, Paper } from '@mui/material';
// import { Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
// import { PieChart } from '@mui/icons-material';
// import { Link } from 'react-router-dom';

// const drawerWidth = 240;

// const Dashboard = ({ isLoggedIn }) => {

// 	//State hooks for create project
// 	const [openDialog, setOpenDialog] = useState(false);
// 	const [newProjectName, setNewProjectName] = useState('');
// 	const [newProjectMembers, setNewProjectMembers] = useState('');
// 	const [flag, setFlag] = useState(true)

// 	const handleDialogOpen = () => {
// 		setOpenDialog(true);
// 	};

// 	const handleDialogClose = () => {
// 		setOpenDialog(false);
// 	};

// 	const handleSubmit = async () => {

// 		try {
// 			var memberEmails = newProjectMembers.split(/[, ]+/);
// 			console.log(memberEmails)
// 			const options = {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify({
// 					name: newProjectName,
// 				}),
// 				credentials: 'include',
// 			};

// 			const response = await fetch('http://localhost:3000/project', options);
// 			console.log(response)
// 			if (response.status === 200) {
// 				console.log('New project created successfully!');
// 				// Optionally, you can fetch the updated list of projects after creating a new one.
// 				// Update the projectNames state or perform any other necessary actions.
// 			} else {
// 				console.error('Failed to create a new project');
// 			}
// 			handleDialogClose();
// 			setNewProjectName('');
// 			setFlag(false)

// 		} catch (error) {
// 			console.error('Error creating a new project:', error);
// 		}
// 	};


// 	// Functionality for navigation clicks will need to be implemented
// 	const [projectNames, setProjectNames] = useState([]);
// 	const [currentProject, setCurrentProject] = useState({ name: "loading" })
// 	const handleNavClick = (page) => {
// 		// Logic to handle navigation
// 		console.log(`Navigate to ${page}`);
// 	};
// 	const handleButtonClick = (project) => {
// 		setCurrentProject(project)
// 	}
// 	useEffect(() => {
// 		try {
// 			var options = {
// 				method: 'get',
// 				credentials: 'include'
// 			}
// 			fetch(`http://localhost:8080/api/user/projects`, options).then((result) => {
// 				console.log(result)
// 				if (result.status == 200) {
// 					console.log(result)
// 				}
// 				result.json().then((response) => {
// 					console.log(response)
// 					setProjectNames(response)
// 					if (response.length > 0) {
// 						setCurrentProject(response[0])
// 					} else {
// 						setCurrentProject({ name: "You have no projects yet, click Create New Project to make one. " })
// 					}
// 				})
// 			})

// 		} catch (error) {
// 			console.log(error)
// 		}

// 	}, [flag])
// 	return (
// 		<>
// 			<Box display="flex">
// 				<Drawer
// 					sx={{
// 						width: drawerWidth,
// 						flexShrink: 0,
// 						'& .MuiDrawer-paper': {
// 							width: drawerWidth,
// 							boxSizing: 'border-box',
// 							marginTop: '150px',
// 						},
// 					}}
// 					variant="permanent"
// 					anchor="left"
// 				>
// 					<Typography variant="h6" sx={{ padding: 2 }}>
// 						Dashboard
// 					</Typography>

// 					{/* Project list */}
// 					<List>
// 						{projectNames.map((text, index) => (
// 							<ListItem button key={text.name} onClick={() => handleButtonClick(text)} >
// 								<ListItemText primary={text.name} />
// 							</ListItem>
// 						))}
// 					</List>

// 					{/* Create new project button */}
// 					<Button sx={{ margin: 2 }} variant="contained" color="primary" onClick={handleDialogOpen}>
// 						Create New Project
// 					</Button>
// 				</Drawer>
// 				{/* Project data display box */}
// 				<Box
// 					component="main"
// 					sx={{ flexGrow: 1, bgcolor: 'background.default', padding: 3, marginTop: '50px' }}
// 				>
// 					<Typography variant="h5" gutterBottom>
// 						{currentProject.name}
// 					</Typography>

// 					<Paper sx={{ padding: 2, margin: '10px 0' }}>
// 						{/* Pie chart to be implemented */}
// 						<PieChart />
// 						<Typography variant="body1">
// 							Pie Graph of Completed Tasks vs Incomplete
// 						</Typography>
// 					</Paper>

// 					{/* Buttons to view release plan and sprint pages */}
// 					<Button
// 						variant="contained"
// 						color="secondary"
// 						component={Link}
// 						to="/releases"
// 						state={{ currentProject }}
// 					>
// 						View Release Plan
// 					</Button>

// 					<Button
// 						sx={{ marginLeft: 2 }}
// 						variant="contained"
// 						color="secondary"
// 						component={Link}
// 						to="/sprints"
// 						state={{ currentProject }}
// 					>
// 						View Sprints
// 					</Button>
// 				</Box>
// 			</Box>

// 			{/* Create a new project dialog */}
// 			<Dialog open={openDialog} onClose={handleDialogClose}>
// 				<DialogTitle>Create New Project</DialogTitle>

// 				<DialogContent>
// 					<TextField
// 						autoFocus
// 						margin="dense"
// 						id="project-name"
// 						label="Project Name"
// 						type="text"
// 						fullWidth
// 						variant="standard"
// 						value={newProjectName}
// 						onChange={(e) => setNewProjectName(e.target.value)}
// 					/>

// 					<TextField
// 						margin="dense"
// 						id="project-members"
// 						label="Add Members By Email, Separate Each One By a Coma"
// 						type="text"
// 						fullWidth
// 						variant="standard"
// 						value={newProjectMembers}
// 						onChange={(e) => setNewProjectMembers(e.target.value)}
// 					/>
// 				</DialogContent>

// 				<DialogActions>
// 					<Button onClick={handleDialogClose}>Cancel</Button>
// 					<Button onClick={handleSubmit}>Create</Button>
// 				</DialogActions>
// 			</Dialog>
// 		</>
// 	);
// };

// export default Dashboard;
