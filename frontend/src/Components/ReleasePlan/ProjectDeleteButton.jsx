import { useState } from 'react';
import Button from '@mui/material/Button';
import { IconButton } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteProjectAPI } from '../../API/project';
import { Dialog, DialogTitle, DialogActions } from '@mui/material'

export default function ProjectDeleteButton({ rows, setRows, name, id }) {
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deletedProjectName, setDeletedProjectName] = useState('');
	const [deleteProjectId, setDeleteProjectId] = useState(null);

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

	function fetchDeleteProject() {
		const resultSuccessHandler = (response) => {
			const filtered = rows.filter((projRowData) => { return projRowData.id !== deleteProjectId });
			setRows(filtered);
		}
		deleteProjectAPI(deleteProjectId, resultSuccessHandler);
	}

	return <>
		<IconButton
			onClick={() => {
				handleDeleteDialogOpen(name, id)
			}}
		>
			<DeleteIcon fontSize="small" />
		</IconButton>

		<Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} maxWidth="sm" fullWidth>
			<DialogTitle>Are you sure you want to leave "{deletedProjectName}"?</DialogTitle>
			<DialogActions>
				<Button onClick={handleDeleteDialogClose}>Cancel</Button>
				<Button onClick={handleDelete} color="error">Leave</Button>
			</DialogActions>
		</Dialog>
	</>
}