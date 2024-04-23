import * as React from 'react';
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
import ListItemIcon from '@mui/material/ListItemIcon';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InboxIcon from '@mui/icons-material/Inbox';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'

export default function Dashboard({ setName }) {
	const [rows, setRows] = useState([]);

	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');

	const [shareDialogOpen, setShareDialogOpen] = useState(false);


	const [renameDialogOpen, setRenameDialogOpen] = useState(false);
	const [renameProjectTextfield, setRenameProjectTextfield] = useState('');

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);



	const handleCreateDialogOpen = () => {
		setCreateDialogOpen(true);
	};

	const handleCreateDialogClose = () => {
		setCreateDialogOpen(false);
	};

	const handleCreate = () => {
		handleCreateDialogClose();
		// TODO: do something with newProjectName
		setNewProjectName('')
	};

	const handleRenameDialogOpen = (projectName) => {
		setRenameProjectTextfield(projectName)
		setRenameDialogOpen(true);
	};

	const handleRenameDialogClose = () => {
		setRenameProjectTextfield('')
		setRenameDialogOpen(false);
	};

	const handleRename = () => {
		setRenameDialogOpen(false);
		// TODO: do something with renameProjectTextfield
		setRenameProjectTextfield('')
	};

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
						<Collapse in={open || renameProjectTextfield} timeout="auto" unmountOnExit>
							<Box sx={{ margin: 1 }}>
								<Box display="flex" justifyContent="space-between" alignItems="center">
									<Typography variant="h6" gutterBottom component="div">
										Shortcuts
									</Typography>
									<ListItemIcon>
										<IconButton
											onClick={() => {
												console.log("adding person");
											}}
										>
											<PersonAddIcon fontSize="small" />
										</IconButton>
										<IconButton
											onClick={() => {
												handleRenameDialogOpen(data.name)
											}}
										>
											<EditIcon fontSize="small" />
										</IconButton>
										<IconButton
											onClick={() => {
												console.log("leaving");
											}}
										>
											<DeleteIcon fontSize="small" />
										</IconButton>
									</ListItemIcon>
								</Box>
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
					onClick={handleCreateDialogOpen}
				>
					<AddCircleOutlineIcon fontSize="small" />
				</IconButton>
				<IconButton
					onClick={handleCreateDialogOpen}
				>
					<InboxIcon fontSize="small" />
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

			<Dialog open={createDialogOpen} onClose={handleCreateDialogClose} maxWidth="sm" fullWidth>
				<DialogTitle>Create a new project</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Name"
						type="text"
						fullWidth
						variant="outlined"
						value={newProjectName}
						onChange={(e) => setNewProjectName(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCreateDialogClose}>Cancel</Button>
					<Button onClick={handleCreate} color="primary">Create</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={renameDialogOpen} onClose={handleRenameDialogClose} maxWidth="sm" fullWidth>
				<DialogTitle>Rename your project</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						label="Name"
						type="text"
						fullWidth
						variant="outlined"
						value={renameProjectTextfield}
						onChange={(e) => setRenameProjectTextfield(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleRenameDialogClose}>Cancel</Button>
					<Button onClick={handleRename} color="primary">Create</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
