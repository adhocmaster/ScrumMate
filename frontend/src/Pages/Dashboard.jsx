import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
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

function createData(name, calories, fat, carbs, protein, price) {
	return {
		name,
		calories,
		fat,
		carbs,
		protein,
		price,
		history: [
			{
				date: '2020-01-05',
				customerId: '11091700',
				amount: 3,
			},
			{
				date: '2020-01-02',
				customerId: 'Anonymous',
				amount: 1,
			},
		],
	};
}

function Row(props) {
	const { row } = props;
	const [open, setOpen] = React.useState(false);

	return (
		<React.Fragment>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell component="th" scope="row">
					{row.name}
				</TableCell>
				<TableCell align="right">{row.calories}</TableCell>
				<TableCell align="right">{row.fat}</TableCell>
				<TableCell align="right">{row.carbs}</TableCell>
				<TableCell align="right">{row.protein}</TableCell>
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
								History
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>Date</TableCell>
										<TableCell>Customer</TableCell>
										<TableCell align="right">Amount</TableCell>
										<TableCell align="right">Total price ($)</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.history.map((historyRow) => (
										<TableRow key={historyRow.date}>
											<TableCell component="th" scope="row">
												{historyRow.date}
											</TableCell>
											<TableCell>{historyRow.customerId}</TableCell>
											<TableCell align="right">{historyRow.amount}</TableCell>
											<TableCell align="right">
												{Math.round(historyRow.amount * row.price * 100) / 100}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

Row.propTypes = {
	row: PropTypes.shape({
		calories: PropTypes.number.isRequired,
		carbs: PropTypes.number.isRequired,
		fat: PropTypes.number.isRequired,
		history: PropTypes.arrayOf(
			PropTypes.shape({
				amount: PropTypes.number.isRequired,
				customerId: PropTypes.string.isRequired,
				date: PropTypes.string.isRequired,
			}),
		).isRequired,
		name: PropTypes.string.isRequired,
		price: PropTypes.number.isRequired,
		protein: PropTypes.number.isRequired,
	}).isRequired,
};

const rows = [
	createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
	createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
	createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
	createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
	createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
	createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
	createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
	createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
	createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
	createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
	createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

export default function Dashboard() {
	return (
		<>
			<Typography
				align='left'
				variant="h4"
				sx={{
					paddingLeft: '20px',
					paddingBottom: '20px',
					paddingTop: '55px',
				}}
			>
				My Projects
			</Typography>

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
									Release Plan Version
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="h5">
									Date Created
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="h5">
									Date Modified
								</Typography>
							</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<Row key={row.name} row={row} />
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
