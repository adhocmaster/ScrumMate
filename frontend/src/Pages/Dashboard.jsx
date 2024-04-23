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
import SendIcon from '@mui/icons-material/Send';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';

export default function Dashboard({ setName }) {
	const [rows, setRows] = useState([]);

	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');

	const [shareDialogOpen, setShareDialogOpen] = useState(false);
	const [userList, setUserList] = useState([]);
	const [recipient, setRecipient] = useState('');

	const [renameDialogOpen, setRenameDialogOpen] = useState(false);
	const [renameProjectTextfield, setRenameProjectTextfield] = useState('');

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletedProjectName, setDeletedProjectName] = useState('');

	const handleCreateDialogOpen = () => {
		setCreateDialogOpen(true);
	};

	const handleCreateDialogClose = () => {
		setCreateDialogOpen(false);
	};

	const handleCreate = () => {
		handleCreateDialogClose();
		// TODO: do something with newProjectName
		setNewProjectName('');
	};

	const handleShareDialogOpen = (id) => {
		setShareDialogOpen(true);
	};

	const handleShareDialogClose = (event, reason) => {
		if (reason !== 'backdropClick') {
			setRecipient('');
			setShareDialogOpen(false);
		}
	};

	const handleShare = () => {
		setShareDialogOpen(false);
		// TODO: do something with renameProjectTextfield
		setRecipient('');
	};

	const confirmShare = () => {
		setShareDialogOpen(false);
		setRecipient('');
	};

	const handleRenameDialogOpen = (projectName) => {
		setRenameProjectTextfield(projectName);
		setRenameDialogOpen(true);
	};

	const handleRenameDialogClose = () => {
		setRenameProjectTextfield('');
		setRenameDialogOpen(false);
	};

	const handleRename = () => {
		setRenameDialogOpen(false);
		// TODO: do something with renameProjectTextfield
		setRenameProjectTextfield('');
	};

	const handleDeleteDialogOpen = (id, name) => {
		setDeletedProjectName(name);
		setDeleteDialogOpen(true);
	};

	const handleDeleteDialogClose = () => {
		setDeleteDialogOpen(false);
	};

	const handleDelete = () => {
		setRenameDialogOpen(false);
		// TODO: do deleting/leaving
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
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box sx={{ margin: 1 }}>
								<Box display="flex" justifyContent="space-between" alignItems="center">
									<Typography variant="h6" gutterBottom component="div">
										Shortcuts
									</Typography>
									<ListItemIcon>
										<IconButton
											onClick={() => {
												handleShareDialogOpen(data.id)
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
												handleDeleteDialogOpen(data.id, data.name)
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

			<Dialog
				open={shareDialogOpen}
				onClose={handleShareDialogClose}
				maxWidth="sm"
				fullWidth
				slotProps={{
					backdrop: undefined
				}}
			>
				<DialogTitle>Manage access to your project</DialogTitle>

				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
					<List sx={{ width: '90%', bgcolor: 'background.paper' }}>
						<Divider />
						<ListItem>
							<ListItemIcon>
								<Avatar>U</Avatar>
							</ListItemIcon>
							<ListItemText primary="User1" />
							<IconButton edge="end" aria-label="delete" onClick={() => { console.log('hi') }}>
								<DeleteIcon />
							</IconButton>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemIcon>
								<Avatar>U</Avatar>
							</ListItemIcon>
							<ListItemText primary="User2" />
							<IconButton edge="end" aria-label="delete" onClick={() => { console.log('hi') }}>
								<DeleteIcon />
							</IconButton>
						</ListItem>
						<Divider />
						<ListItem>
							<ListItemIcon>
								<Avatar>Y</Avatar>
							</ListItemIcon>
							<ListItemText primary="You" />
						</ListItem>
						<Divider />
					</List>
				</Box>

				<DialogContent>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<TextField
							autoFocus
							margin="dense"
							label="Recipient email"
							type="text"
							variant="outlined"
							sx={{ width: '90%', mr: 1 }} // <-- Adjust the width here
							onChange={(e) => setRecipient(e.target.value)}
						/>
						<IconButton edge="end" aria-label="send" onClick={() => { console.log('hi') }}>
							<SendIcon fontSize="large" />
						</IconButton>
					</Box>
				</DialogContent>
				<Box sx={{ padding: '16px 10px' }}>
					<Button variant="outlined" onClick={confirmShare} color="primary" fullWidth>
						Confirm List
					</Button>
				</Box>
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
					<Button onClick={handleRename} color="primary">Rename</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} maxWidth="sm" fullWidth>
				<DialogTitle>Are you sure you want to leave "{deletedProjectName}"?</DialogTitle>
				<DialogActions>
					<Button onClick={handleDeleteDialogClose}>Cancel</Button>
					<Button onClick={handleDelete} color="error">Leave</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
