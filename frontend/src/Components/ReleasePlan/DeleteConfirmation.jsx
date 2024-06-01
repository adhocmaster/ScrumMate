import { useState } from 'react';
import { Button } from '@mui/material';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

const DeleteConfirmation = ({ onDelete, type = 'sprint' }) => {
	const [open, setOpen] = useState(false);

	const handleDelete = () => {
		onDelete();
		handleClose();
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Button sx={{ color: 'red' }} onClick={() => setOpen(true)}>
				Delete
			</Button>

			<DeleteConfirmationDialog open={open} handleClose={handleClose} handleDelete={handleDelete} type={type} />
		</>
	);
}

export default DeleteConfirmation;
