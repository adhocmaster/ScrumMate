import React, { useEffect, useState } from 'react'
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
import { projectUserListAPI } from '../../API/project';
import { deleteSprintAPI, editSprintAPI } from '../../API/sprint';

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

	const handleIndexChange = () => {
		setScrumMasterId(sprint.scrumMaster ? sprint.scrumMaster.id : '')
		setStartDate(sprint.startDate ? dayjs(sprint.startDate) : null)
		setEndDate(sprint.endDate ? dayjs(sprint.endDate) : null)
		setScrumMasterIdTemp(sprint.scrumMaster ? sprint.scrumMaster.id : '')
		setStartDateTemp(sprint.startDate ? dayjs(sprint.startDate) : null)
		setEndDateTemp(sprint.endDate ? dayjs(sprint.endDate) : null)
	}

	useEffect(() => {
		handleIndexChange()
	}, [index])

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
		const resultSuccessHandler = (response) => {
			setTeamMembers(response[2]);
		}
		projectUserListAPI(projectId, resultSuccessHandler);
	};

	useState(() => {
		fetchProjectMembers()
	}, [teamMembers])

	function fetchSaveOptions() {
		const resultSuccessHandler = (response) => {
			const sprintsCopy = [...sprints];
			sprintsCopy[index].startDate = response.startDate;
			sprintsCopy[index].endDate = response.endDate;
			sprintsCopy[index].scrumMaster = response.scrumMaster ?? sprintsCopy[index].scrumMaster;
			setSprints(sprintsCopy);
			setScrumMasterId(sprintsCopy[index].scrumMaster ? sprintsCopy[index].scrumMaster.id : '');
			setScrumMasterIdTemp(sprintsCopy[index].scrumMaster ? sprintsCopy[index].scrumMaster.id : '');
			setStartDate(response.startDate ? dayjs(response.startDate) : null);
			setStartDateTemp(response.startDate ? dayjs(response.startDate) : null);
			setEndDate(response.endDate ? dayjs(response.endDate) : null);
			setEndDateTemp(response.endDate ? dayjs(response.endDate) : null);
		}
		editSprintAPI(sprint.id, startDateTemp, endDateTemp, scrumMasterIdTemp, resultSuccessHandler);
	}

	function deleteSprint(sprintId, index) {
		const resultSuccessHandler = (response) => {
			setSprints(response[0])
			setBacklogItems(response[1])
		}
		deleteSprintAPI(sprintId, resultSuccessHandler);
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
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<DeleteConfirmation
						onDelete={() => {
							deleteSprint(sprint.id, index);
							handleClose();
						}}
					/>
					<Button variant="contained" onClick={() => {
						handleClose();
						fetchSaveOptions()
					}}>
						Save
					</Button>
				</DialogActions>
			</Dialog >
		</>
	);
};

export default SprintOptions
