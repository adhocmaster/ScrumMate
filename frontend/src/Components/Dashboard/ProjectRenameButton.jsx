import { useState } from 'react';
import { IconButton } from "@mui/material"
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import { renameProjectAPI } from '../../API/project'
import { isValidProjectName } from '../common/utils';

export default function ProjectRenameButton({ rows, setRows, name, id }) {
	const [renameDialogOpen, setRenameDialogOpen] = useState(false);
	const [renameProjectTextfield, setRenameProjectTextfield] = useState('');
	const [renameProjectId, setRenameProjectId] = useState(null);

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

	function fetchRenameProject() {
		const resultSuccessHandler = (response) => {
			const index = rows.findIndex(obj => obj.id === renameProjectId);
			const rowsCopy = [...rows];
			rowsCopy[index] = response;
			setRows(rowsCopy);
		}
		renameProjectAPI(renameProjectId, renameProjectTextfield, resultSuccessHandler);
	}

	return <>
		<IconButton
			onClick={() => {
				handleRenameDialogOpen(name, id)
			}}
		>
			<EditIcon fontSize="small" />
		</IconButton>

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
	</>
}