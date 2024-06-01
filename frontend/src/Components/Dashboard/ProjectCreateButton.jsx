import { useState } from 'react';
import Button from '@mui/material/Button';
import { IconButton } from "@mui/material"
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { newProjectAPI } from '../../API/project';
import { isValidProjectName } from '../common/utils';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'

export default function ProjectCreateButton({ rows, setRows }) {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [newProjectName, setNewProjectName] = useState('');

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

	function fetchCreateNewProject() {
		const resultSuccessHandler = (result) => setRows(rows.concat(result));
		newProjectAPI(newProjectName, resultSuccessHandler);
	}

	return <>
		<IconButton
			onClick={handleCreateDialogOpen}
		>
			<AddCircleOutlineIcon fontSize="small" />
		</IconButton>

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
	</>
}