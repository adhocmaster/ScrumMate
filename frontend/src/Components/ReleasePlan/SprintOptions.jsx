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
	const [scrumMasterId, setScrumMasterId] = useState(sprint.scrumMaster ? sprint.scrumMaster.id : '')
	const [startDate, setStartDate] = useState(sprint.startDate ? dayjs(sprint.startDate) : null)
	const [endDate, setEndDate] = useState(sprint.endDate ? dayjs(sprint.endDate) : null)
	const [teamMembers, setTeamMembers] = useState([])

	const [scrumMasterIdTemp, setScrumMasterIdTemp] = useState(sprint.scrumMaster ? sprint.scrumMaster.id : '')
	const [startDateTemp, setStartDateTemp] = useState(sprint.startDate ? dayjs(sprint.startDate) : null)
	const [endDateTemp, setEndDateTemp] = useState(sprint.endDate ? dayjs(sprint.endDate) : null)

	const handleOpen = () => {
		setScrumMasterIdTemp(scrumMasterId)
		setStartDateTemp(startDate)
		setEndDateTemp(endDate)
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
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
				startDate: startDateTemp,
				endDate: endDateTemp,
				scrumMasterId: scrumMasterIdTemp,
			}),
		};

		try {
			fetch(
				`http://localhost:8080/api/sprint/${sprint.id}/edit`,
				options
			).then((result) => {
				if (result.status === 200) {
					result.json().then(jsonResult => {
						const sprintsCopy = [...sprints]
						sprintsCopy[index].startDate = jsonResult.startDate
						sprintsCopy[index].endDate = jsonResult.endDate
						sprintsCopy[index].scrumMaster = jsonResult.scrumMaster ?? sprintsCopy[index].scrumMaster
						setSprints(sprintsCopy)
						setScrumMasterId(sprintsCopy[index].scrumMaster ? sprintsCopy[index].scrumMaster.id : '')
						setScrumMasterIdTemp(sprintsCopy[index].scrumMaster ? sprintsCopy[index].scrumMaster.id : '')
						setStartDate(jsonResult.startDate ? dayjs(jsonResult.startDate) : null)
						setStartDateTemp(jsonResult.startDate ? dayjs(jsonResult.startDate) : null)
						setEndDate(jsonResult.endDate ? dayjs(jsonResult.endDate) : null)
						setEndDateTemp(jsonResult.endDate ? dayjs(jsonResult.endDate) : null)
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
			<IconButton onClick={handleOpen}>
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
							key={scrumMasterIdTemp}
							value={scrumMasterIdTemp}
							label="Scrum Master"
							onChange={(e) => {
								setScrumMasterIdTemp(e.target.value)
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
								value={startDateTemp}
								onChange={setStartDateTemp}
								sx={{ mr: 2 }}
							/>
							<DatePicker
								label="End Date"
								value={endDateTemp}
								onChange={setEndDateTemp}
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
