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

const SprintOptions = ({ sprints, setSprints, setBacklogItems, index }) => {

	const [open, setOpen] = useState(false);
	const [scrumMaster, setScrumMaster] = useState('')

	const handleClose = () => {
		setOpen(false);
	};

	const deleteSprint = (sprintId, index) => {
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
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={scrumMaster}
							label="Scrum Master"
							onChange={(e) => setScrumMaster(e.target.value)}
						>
							<MenuItem value={10}>Ten</MenuItem>
							<MenuItem value={20}>Twenty</MenuItem>
							<MenuItem value={30}>Thirty</MenuItem>
						</Select>
					</FormControl>
					<Box sx={{ mt: 2 }}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker label="Start Date" sx={{ mr: 2 }} />
							<DatePicker label="End Date" />
						</LocalizationProvider>
					</Box>
				</DialogContent>

				<DialogActions>
					<Button>
						Save
					</Button>
					<DeleteConfirmation
						onDelete={() => {
							const sprintId = sprints[index].id;
							deleteSprint(sprintId, index);
							handleClose();
						}}
					/>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>


	);

};

export default SprintOptions
