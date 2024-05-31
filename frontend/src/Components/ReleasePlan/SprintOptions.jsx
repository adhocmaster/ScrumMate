import React, { useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/material';
import DeleteConfirmation from './DeleteConfirmation'
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import dayjs from 'dayjs';

const SprintOptions = ({ sprints, setSprints, setBacklogItems, index, projectId }) => {
	const sprint = sprints[index]

	const [open, setOpen] = useState(false);
	const [actualScrumMasterId, setActualScrumMasterId] = useState(sprint.scrumMaster ? sprint.scrumMaster.id : '')
	const [scrumMasterId, setScrumMasterId] = useState(sprint.scrumMaster ? sprint.scrumMaster.id : '')
	const [startDate, setStartDate] = useState(sprint.startDate ? dayjs(sprint.startDate) : null)
	const [endDate, setEndDate] = useState(sprint.endDate ? dayjs(sprint.endDate) : null)
	const [teamMembers, setTeamMembers] = useState([])

	const handleClose = () => {
		setOpen(false);
		setScrumMasterId(actualScrumMasterId)
	};

	function fetchProjectMembers() {
		var options = {
			method: 'get',
			credentials: 'include'
		}
		try {
			fetch(`http://localhost:8080/api/project/${projectId}/getMembers`, options).then((result) => {
				if (result.status === 200) {
					result.json().then((response) => {
						setTeamMembers(response[2]);
					})
				}
			})
		}
		catch {
			return;
		}
	};

	useState(() => {
		fetchProjectMembers()
	}, [teamMembers])

	function fetchSaveOptions() {
		var options = {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				startDate: startDate,
				endDate: endDate,
				scrumMasterId: scrumMasterId,
			}),
		};

		try {
			fetch(
				`http://localhost:8080/api/sprint/${sprint.id}/edit`,
				options
			).then((result) => {
				if (result.status === 200) {
					result.json().then(jsonResult => {
						setActualScrumMasterId(jsonResult.scrumMaster.id)
						const sprintsCopy = [...sprints]
						sprintsCopy[index].startDate = jsonResult.startDate
						sprintsCopy[index].endDate = jsonResult.endDate
						sprintsCopy[index].scrumMaster = jsonResult.scrumMaster
						setSprints(sprintsCopy)
						setScrumMasterId(jsonResult.scrumMaster.id)
					})
				} else {
					console.log("error", result);
				}
			});
		} catch {
			return null;
		}
	}

	function deleteSprint(sprintId, index) {
		fetch(`http://localhost:8080/api/sprint/${sprintId}`, {
			method: "DELETE",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		})
			.then((response) => {
				response.json().then(jsonResult => {
					console.log(jsonResult)
					setSprints(jsonResult[0])
					setBacklogItems(jsonResult[1])
				})
			})
			.catch((error) => console.log("error deleting sprint:"));
	};

	return (
		<>
			<IconButton onClick={() => setOpen(true)}>
				<MoreHorizIcon fontSize='medium' />
			</IconButton>
			<Dialog open={open} onClose={handleClose} sx={{ width: '100%' }}>
				<DialogTitle>
					Sprints Options
				</DialogTitle>
				<DialogContent>
					<FormControl fullWidth sx={{ mt: 1 }}>
						<InputLabel id="scrum-master-select-label">Scrum Master</InputLabel>
						<Select
							labelId="scrum-master-select-label"
							id="scrum-master-select"
							key={scrumMasterId}
							value={scrumMasterId}
							label="Scrum Master"
							onChange={(e) => {
								setScrumMasterId(e.target.value)
							}
							}
						>
							{
								teamMembers.map(user =>
									<MenuItem key={user.id} value={user.id}>
										{user.username}
									</MenuItem>
								)
							}
						</Select>
					</FormControl>
					<Box sx={{ mt: 2 }}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								label="Start Date"
								value={startDate}
								onChange={setStartDate}
								sx={{ mr: 2 }}
							/>
							<DatePicker
								label="End Date"
								value={endDate}
								onChange={setEndDate}
							/>
						</LocalizationProvider>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => {
						handleClose();
						fetchSaveOptions()
					}}>
						Save
					</Button>
					<DeleteConfirmation
						onDelete={() => {
							deleteSprint(sprint.id, index);
							handleClose();
						}}
					/>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog >
		</>
	);
};

export default SprintOptions
