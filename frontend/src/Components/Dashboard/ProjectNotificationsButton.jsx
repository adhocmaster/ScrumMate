import { useState, useEffect } from 'react';
import { IconButton } from "@mui/material"
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { acceptInviteAPI, rejectInviteAPI, fetchNotificationsAPI } from '../../API/user'

export default function ProjectNotificationsButton({ rows, setRows }) {
	const [inviteList, setInviteList] = useState([]);
	const [invitesDialogOpen, setInvitesDialogOpen] = useState(false);

	const handleInvitesDialogOpen = () => {
		setInvitesDialogOpen(true);
	};

	const handleInvitesDialogClose = () => {
		setInvitesDialogOpen(false);
	};

	function fetchNotifications() {
		fetchNotificationsAPI(setInviteList);
	}

	useEffect(() => {
		fetchNotifications();
	}, []);

	function fetchAcceptInvite(projectId) {
		const resultSuccessHandler = (response) => {
			setInviteList(response[0]);
			setRows(rows.concat(response[1]));
		}
		acceptInviteAPI(projectId, resultSuccessHandler);
	}

	function fetchRejectInvite(projectId) {
		rejectInviteAPI(projectId, setInviteList);
	}

	return <>
		<IconButton
			onClick={handleInvitesDialogOpen}
		>
			{inviteList.length > 0 ? <NotificationsActiveIcon fontSize="small" style={{ color: 'red' }} /> : <NotificationsNoneIcon fontSize="small" />}
		</IconButton>

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
	</>
}