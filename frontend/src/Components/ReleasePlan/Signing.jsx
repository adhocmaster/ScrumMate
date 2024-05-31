import { React, useEffect, useState } from 'react'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import {
	IconButton, Dialog, DialogTitle, ListItemText,
	ListItem, ListItemIcon, Avatar, Box, List, Button,
	Typography,
	DialogContent,
	DialogActions,
} from "@mui/material";

import ReportProblemIcon from '@mui/icons-material/ReportProblem'

import RestoreIcon from '@mui/icons-material/Restore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const Signing = ({ releaseId, projectId, setLockPage, clickDetector }) => {
	const [open, setOpen] = useState(false);
	const [openNotComplete, setOpenNotComplete] = useState(false);
	const [signatures, setSignatures] = useState([[], [], null]);
	const [ownUserId, setOwnUserId] = useState(null);
	const [productOwnerId, setProductOwnerId] = useState(undefined);
	const [canSign, setCanSign] = useState(false);

	const handleClickOpen = () => {
		fetchUserId();
		fetchProjectMembers();
		fetchUserList();
		setOpen(true);
	};

	const handleClickClose = () => {
		setOpen(false);
	}

	const handleClickNotCompleteOpen = () => {
		setOpenNotComplete(true);
	}

	const handleClickNotCompleteClose = () => {
		setOpenNotComplete(false);
	}

	const handleButtonClick = () => {
		if (!signatures[2] && !(signatures[1].length > 0) && !canSign) {
			handleClickNotCompleteOpen()
		} else {
			handleClickOpen()
		}
	}

	const handleToggleSigningClick = () => {
		fetchToggleSigning();
	}

	function fetchUserList() {
		var options = {
			method: 'get',
			credentials: 'include'
		}
		try {
			fetch(`http://localhost:8080/api/release/${releaseId}/signatures`, options).then((result) => {
				if (result.status === 200) {
					result.json().then((response) => {
						setSignatures(response);
					})
				}
			})
		}
		catch {
			return;
		}
	};

	useEffect(() => {
		fetchUserList();
	}, [releaseId])

	function fetchProjectMembers() {
		var options = {
			method: 'get',
			credentials: 'include'
		}
		try {
			fetch(`http://localhost:8080/api/project/${projectId}/getMembers`, options).then((result) => {
				if (result.status === 200) {
					result.json().then((response) => {
						setProductOwnerId(response[1].id);
					})
				}
			})
		}
		catch {
			return;
		}
	};

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

	function fetchToggleSigning() {
		var options = {
			method: 'post',
			credentials: 'include',
		}
		try {
			fetch(`http://localhost:8080/api/release/${releaseId}/toggleSign`, options).then((result) => {
				if (result.status === 200) {
					result.json().then((response) => {
						setSignatures(response);
						setLockPage(response[1].length > 0);
					})
				}
			})
		} catch {
			return;
		}
	}

	async function fetchCanSign() {
		var options = {
			method: 'get',
			credentials: 'include'
		}
		try {
			const result = await fetch(`http://localhost:8080/api/release/${releaseId}/signingCondtion`, options);
			if (result.status === 200) {
				const response = await result.json();
				setCanSign(response);
			}
		} catch {
			return;
		}
	};

	useEffect(() => {
		fetchCanSign();
	}, [clickDetector])

	return (
		<>
			<IconButton onClick={handleButtonClick}>
				{
					signatures[2] ?
						<HistoryEduIcon style={{ color: 'green' }} /> :
						signatures[1].length > 0 ?
							<HistoryEduIcon style={{ color: '#ffcd38' }} /> :
							<HistoryEduIcon />
				}
			</IconButton>

			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
				{
					!signatures[2] && !(signatures[1].length > 0) && !canSign ?
						<Dialog open={openNotComplete} onClose={handleClickNotCompleteClose}>
							<DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
								<ReportProblemIcon fontSize="large" sx={{ padding: '1px 10px', color: '#ffcd38' }} />
								This release is not ready!
							</DialogTitle>
							<DialogContent>
								<Typography>
									This revision is currently missing some information. Are you sure you want to begin signing it?
								</Typography>
							</DialogContent>
							<DialogActions>
								<Button
									variant="contained"
									color="primary"
									onClick={handleClickNotCompleteClose}
									sx={{ padding: '1px', width: '50%' }}
								>
									Cancel
								</Button>
								<Button
									variant="outlined"
									color="primary"
									onClick={(e) => {
										e.stopPropagation();
										setCanSign(true)
										handleClickOpen();
										handleClickNotCompleteClose();
									}}
									sx={{ paddingTop: '100px', padding: '1px', width: '50%' }}
								>
									Sign anyway
								</Button>
							</DialogActions>
							<br />
						</Dialog >
						:
						<Dialog open={open} onClose={handleClickClose} maxWidth="sm" fullWidth>
							<DialogTitle>
								Signatures
							</DialogTitle>
							<List fullWidth sx={{ bgcolor: 'background.paper' }}>
								{signatures[0].map((unsignedUser) =>
									<ListItem key={unsignedUser.id}>
										<ListItemIcon>
											<Avatar>{unsignedUser.id === productOwnerId ? "PO" : "TM"}</Avatar>
										</ListItemIcon>
										<ListItemText primary={unsignedUser.username} />
										<ListItemIcon>
											<RestoreIcon fontSize="large" />
										</ListItemIcon>
									</ListItem>
								)
								}
								{signatures[1].map((signedUser) =>
									<ListItem key={signedUser.id}>
										<ListItemIcon>
											<Avatar>{signedUser.id === productOwnerId ? "PO" : "TM"}</Avatar>
										</ListItemIcon>
										<ListItemText primary={signedUser.username} />
										<ListItemIcon>
											<CheckCircleIcon sx={{ color: 'green' }} fontSize='large' />
										</ListItemIcon>
									</ListItem>
								)
								}
							</List>
							{
								signatures[2] ?
									<Box sx={{ padding: '1px 10px' }}>
										<Button variant="contained" disabled color="primary" fullWidth>
											This revision has been permanantly signed
										</Button>
										<Button variant="contained" disabled color="primary" fullWidth>
											To edit the revision, make a copy
										</Button>
									</Box>
									:
									signatures[1].length === 0 && ownUserId !== productOwnerId ?
										<Box sx={{ padding: '1px 10px' }} onClick={handleToggleSigningClick}>
											<Button variant="contained" disabled color="primary" fullWidth>
												Awaiting Product Owner
											</Button>
										</Box>
										: signatures[1].some((user) => user.id === ownUserId) ?
											<Box sx={{ padding: '1px 10px' }} onClick={handleToggleSigningClick}>
												<Button variant="outlined" color="error" fullWidth>
													Remove Signature
												</Button>
											</Box>
											: signatures[1].length > 0 || ownUserId === productOwnerId ?
												<Box sx={{ padding: '1px 10px' }} onClick={handleToggleSigningClick}>
													<Button variant="contained" color="primary" fullWidth>
														Sign Release Plan
													</Button>
												</Box>
												:
												<Box sx={{ padding: '1px 10px' }}>
													<Button variant="contained" color="primary" fullWidth>
														Awaiting Product Owner
													</Button>
												</Box>
							}
							<Box sx={{ padding: '10px 10px' }} onClick={handleClickClose}>
								<Button variant="outlined" color="primary" fullWidth>
									Done
								</Button>
							</Box>
						</Dialog >
				}
			</Box >
		</>
	)
}
