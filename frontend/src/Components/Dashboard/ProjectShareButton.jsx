import { useState } from 'react';
import { IconButton } from "@mui/material"
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, DialogContent, TextField } from '@mui/material'
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { sendInviteAPI, projectUserListAPI, cancelInviteAPI, kickUserAPI } from '../../API/project'

export default function ProjectShareButton({ id, ownUserId }) {
	const [shareDialogOpen, setShareDialogOpen] = useState(false);
	const [userList, setUserList] = useState([[], { username: "loading..." }, []]);
	const [recipient, setRecipient] = useState('');
	const [recipientError, setRecipientError] = useState(false);
	const [sharingProjectId, setSharingProjectId] = useState(null);

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


	function fetchUserList(projectId) {
		const resultSuccessHandler = (response) => {
			setUserList(response)
		}
		projectUserListAPI(projectId, resultSuccessHandler);
	}

	function fetchSendInvite() {
		const resultSuccessHandler = (response) => {
			setUserList(response);
			setRecipient('')
			setRecipientError(false);
		}
		const resultFailureHandler = (response) => {
			setRecipientError(true)
		}
		sendInviteAPI(sharingProjectId, recipient, resultSuccessHandler, resultFailureHandler);
	}

	function fetchCancelInvite(userId) {
		cancelInviteAPI(sharingProjectId, userId, setUserList);
	}

	function fetchKickTeamMember(userId) {
		kickUserAPI(sharingProjectId, userId, setUserList);
	}


	return <>
		<IconButton
			onClick={() => {
				handleShareDialogOpen(id)
			}}
		>
			<PersonAddIcon fontSize="small" />
		</IconButton>

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
							<ListItem key={user.id}>
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
	</>
}