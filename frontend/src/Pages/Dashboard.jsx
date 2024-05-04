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
import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

export default function Dashboard({ setName, setSelectedProjectId }) {
	const [rows, setRows] = useState([]);

	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');

	const [invitesDialogOpen, setInvitesDialogOpen] = useState(false);
	const [inviteList, setInviteList] = useState([]);

	const [shareDialogOpen, setShareDialogOpen] = useState(false);
	const [userList, setUserList] = useState([[], { username: "loading..." }, []]);
	const [recipient, setRecipient] = useState('');
	const [recipientError, setRecipientError] = useState(false);
	const [sharingProjectId, setSharingProjectId] = useState(null);

	const [renameDialogOpen, setRenameDialogOpen] = useState(false);
	const [renameProjectTextfield, setRenameProjectTextfield] = useState('');
	const [renameProjectId, setRenameProjectId] = useState(null);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletedProjectName, setDeletedProjectName] = useState('');
	const [deleteProjectId, setDeleteProjectId] = useState(null);

	const [ownUserId, setOwnUserId] = useState(null);

	const handleCreateDialogOpen = () => {
		setCreateDialogOpen(true);
	};

	const handleCreateDialogClose = () => {
		setCreateDialogOpen(false);
	};

	const handleCreate = () => {
		if (!isValidProjectName(newProjectName)) {
			return;
		}
		handleCreateDialogClose();
		fetchCreateNewProject();
		setNewProjectName('');
	};

	const handleInvitesDialogOpen = () => {
		setInvitesDialogOpen(true);
	};

	const handleInvitesDialogClose = () => {
		setInvitesDialogOpen(false);
	};

	const handleShareDialogOpen = (projectId) => {
		setSharingProjectId(projectId);
		fetchUserList(projectId);
		setShareDialogOpen(true);
	};

	const handleShareDialogClose = (event, reason) => {
		setRecipientError(false)
		if (reason !== 'backdropClick') {
			setRecipient('');
			setShareDialogOpen(false);
		}
	};

	const handleShare = () => {
		fetchSendInvite();
	};

	const handleShareEnterPress = (event) => {
		event.preventDefault();
		handleShare();
	};

	const confirmShare = () => {
		handleShareDialogClose();
		setSharingProjectId(null);
		setRecipient('');
	};

	const handleRenameDialogOpen = (projectName, projectId) => {
		setRenameProjectTextfield(projectName);
		setRenameProjectId(projectId);
		setRenameDialogOpen(true);
	};

	const handleRenameDialogClose = () => {
		setRenameProjectTextfield('');
		setRenameProjectId(null);
		setRenameDialogOpen(false);
	};

	const handleRename = () => {
		if (!isValidProjectName(renameProjectTextfield)) {
			return;
		}
		fetchRenameProject();
		handleRenameDialogClose();
	};

	const handleRenameEnterPress = (event) => {
		event.preventDefault();
		handleRename();
	};

	const handleDeleteDialogOpen = (name, id) => {
		setDeletedProjectName(name);
		setDeleteProjectId(id)
		setDeleteDialogOpen(true);
	};

	const handleDeleteDialogClose = () => {
		setDeleteDialogOpen(false);
	};

	const handleDelete = () => {
		fetchDeleteProject();
		setDeleteProjectId(null);
		handleDeleteDialogClose();
	};

	function fetchProjectRowData() {
		var options = {
			method: 'get',
			credentials: 'include'
		}
		try {
			fetch(`http://localhost:8080/api/user/projectRowData`, options).then((result) => {
				if (result.status !== 200) {
					console.log("error", result)
				}
				result.json().then((response) => {
					setRows(response)
				})
			})
		} catch {
			return null;
		}
	}

	useEffect(() => {
		fetchProjectRowData();
	}, []);

	function fetchCreateNewProject() {
		var options = {
			method: 'post',
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: newProjectName
			}),
		}
		try {
			fetch(`http://localhost:8080/api/project`, options).then((result) => {
				if (result.status !== 200) {
					console.log("error", result)
				}
				result.json().then((response) => {
					setRows(rows.concat(response))
				})
			})
		} catch {
			return null;
		}
	}

	function isValidProjectName(str) {
		return str !== "";
	}

	function fetchUserId() {
		var options = {
			method: 'get',
			credentials: 'include',
		}
		try {
			fetch(`http://localhost:8080/api/user`, options).then((result) => {
				if (result.status !== 200) {
					console.log("error", result)
					return
				}
				result.json().then((response) => {
					setOwnUserId(response);
				})
			})
		} catch {
			return;
		}
	}

	useEffect(() => {
		fetchUserId();
	}, []);

	function fetchUserList(projectId) {
		var options = {
			method: 'get',
			credentials: 'include',
		}
		try {
			fetch(`http://localhost:8080/api/project/${projectId}/getMembers`, options).then((result) => {
				if (result.status !== 200) {
					console.log("error", result)
					return
				}
				result.json().then((response) => {
					setUserList(response)
				})
			})
		} catch {
			return;
		}
	}

	function fetchSendInvite() {
		var options = {
			method: 'post',
			credentials: 'include',
		}
		try {
			fetch(`http://localhost:8080/api/project/${sharingProjectId}/invite/${recipient}`, options).then((result) => {
				if (result.status !== 200) {
					console.log("error", result)
					setRecipientError(true)
					return
				}
				result.json().then((response) => {
					setUserList(response);
					setRecipient('')
					setRecipientError(false);
				})
			})
		} catch {
			return;
		}
	}

	function fetchCancelInvite(userId) {
		var options = {
			method: 'post',
			credentials: 'include',
		}
		try {
			fetch(`http://localhost:8080/api/project/${sharingProjectId}/cancelInvite/${userId}`, options).then((result) => {
				if (result.status !== 200) {
					console.log("error", result)
					return
				}
				result.json().then((response) => {
					setUserList(response);
				})
			})
		} catch {
			return;
		}
	}

	function fetchKickTeamMember(userId) {
		var options = {
			method: 'post',
			credentials: 'include',
		}
		try {
			fetch(`http://localhost:8080/api/project/${sharingProjectId}/removeMember/${userId}`, options).then((result) => {
				if (result.status !== 200) {
					console.log("error", result)
					return
				}
				result.json().then((response) => {
					setUserList(response);
				})
			})
		} catch {
			return;
		}
	}

	function fetchNotifications() {
		var options = {
			method: 'get',
			credentials: 'include',
		}
		try {
			fetch(`http://localhost:8080/api/user/getInvites`, options).then((result) => {
				if (result.status !== 200) {
					console.log("error", result)
				}
				result.json().then((response) => {
					setInviteList(response)
				})
			})
		} catch {
			return null;
		}
	}

	useEffect(() => {
		fetchNotifications();
	}, []);

	function fetchAcceptInvite(projectId) {
		var options = {
			method: 'post',
			credentials: 'include',
		}
		try {
			fetch(`http://localhost:8080/api/user/acceptInvite/${projectId}`, options).then((result) => {
				if (result.status !== 200) {
					console.log("error", result)
				}
				result.json().then((response) => {
					setInviteList(response[0])
					setRows(rows.concat(response[1]))
				})
			})
		} catch {
			return null;
		}
	}

	function fetchRejectInvite(projectId) {
		var options = {
			method: 'post',
			credentials: 'include',
		}
		try {
			fetch(`http://localhost:8080/api/user/rejectInvite/${projectId}`, options).then((result) => {
				if (result.status !== 200) {
					console.log("error", result)
				}
				result.json().then((response) => {
					setInviteList(response)
				})
			})
		} catch {
			return null;
		}
	}

	function fetchRenameProject() {
		var options = {
			method: 'PATCH',
			credentials: 'include',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: renameProjectTextfield
			}),
		}
		try {
			fetch(`http://localhost:8080/api/project/${renameProjectId}`, options).then((result) => {
				if (result.status === 200) {
					result.json().then((response) => {
						const index = rows.findIndex(obj => obj.id === renameProjectId);
						const rowsCopy = [...rows]
						rowsCopy[index] = response;
						setRows(rowsCopy)
					})
				}
			})
		} catch {
			console.log("failed to rename project")
			return null;
		}
	}

	function fetchDeleteProject() {
		var options = {
			method: 'DELETE',
			credentials: 'include',
		}
		try {
			fetch(`http://localhost:8080/api/project/${deleteProjectId}`, options).then((result) => {
				if (result.status === 200) {
					const filtered = rows.filter((projRowData) => { return projRowData.id !== deleteProjectId });
					setRows(filtered)
				}
			})
		} catch {
			console.log("failed to delete project")
			return null;
		}
	}

	function Row(projectData) {
		const [open, setOpen] = useState(false);
		const data = projectData.row // may need to remove to update
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
							onClick={() => {
								setName(data.name);
								setSelectedProjectId(data.id);
							}}
						>
							{data.name}
						</Button>
					</TableCell>
					<TableCell align="right">{data.productOwner.username}</TableCell>
					<TableCell align="right">{data.numRevisions}</TableCell>
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
												handleRenameDialogOpen(data.name, data.id)
											}}
										>
											<EditIcon fontSize="small" />
										</IconButton>
										<IconButton
											onClick={() => {
												handleDeleteDialogOpen(data.name, data.id)
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
					onClick={handleInvitesDialogOpen}
				>
					{inviteList.length > 0 ? <NotificationsActiveIcon fontSize="small" style={{ color: 'red' }} /> : <NotificationsNoneIcon fontSize="small" />}
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

			<Dialog open={invitesDialogOpen} onClose={handleInvitesDialogClose} maxWidth="sm" fullWidth>
				<DialogTitle>Project invitations</DialogTitle>
				<DialogContent>
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
						<List sx={{ width: '90%', bgcolor: 'background.paper' }}>
							{inviteList.length > 0 && <Divider />}
							{inviteList.map(invitedProject =>
								<>
									<ListItem>
										<ListItemText primary={invitedProject.name} />
										<IconButton edge="end" aria-label="delete" onClick={() => { fetchAcceptInvite(invitedProject.id) }} sx={{ marginRight: 1 }}>
											<CheckIcon />
										</IconButton>
										<IconButton edge="end" aria-label="delete" onClick={() => { fetchRejectInvite(invitedProject.id) }}>
											<CloseIcon />
										</IconButton>
									</ListItem>
									<Divider />
								</>)}
						</List>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleInvitesDialogClose}>Done</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={shareDialogOpen}
				onClose={handleShareDialogClose}
				disableEscapeKeyDown={true}
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
						{userList[0].map((user) => (
							<>
								<ListItem>
									<ListItemIcon>
										<Avatar>Inv</Avatar>
									</ListItemIcon>
									<ListItemText primary={user.username} />
									<IconButton edge="end" aria-label="delete" onClick={() => { fetchCancelInvite(user.id) }}>
										<CloseIcon />
									</IconButton>
								</ListItem>
								<Divider />
							</>
						))}
						<ListItem>
							<ListItemIcon>
								<Avatar>PO</Avatar>
							</ListItemIcon>
							<ListItemText primary={userList[1].username} />
						</ListItem>
						<Divider />
						{userList[2].map((user) => (
							<>
								<ListItem>
									<ListItemIcon>
										<Avatar>TM</Avatar>
									</ListItemIcon>
									<ListItemText primary={user.username} />
									{ownUserId === userList[1].id &&
										<IconButton edge="end" aria-label="delete" onClick={() => { fetchKickTeamMember(user.id) }}>
											<DeleteIcon />
										</IconButton>}
								</ListItem>
								<Divider />
							</>
						))}
					</List>
				</Box>

				<DialogContent>
					<Box
						component="form"
						onSubmit={handleShareEnterPress}
						sx={{ display: 'flex', alignItems: 'center' }}
					>
						<TextField
							error={recipientError}
							helperText={recipientError ? "User not found or is already on the list" : ""}
							autoFocus
							margin="dense"
							label="Recipient email"
							type="text"
							variant="outlined"
							sx={{ width: '90%', mr: 1 }}
							value={recipient}
							onChange={(e) => setRecipient(e.target.value)}
						/>
						<IconButton
							edge="end"
							aria-label="send"
							onClick={handleShare}
						>
							<SendIcon fontSize="large" style={{ color: '#3477eb' }} />
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
				<Box
					component="form"
					onSubmit={handleRenameEnterPress}
				>
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
				</Box>
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
