import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';    

const DeleteConfirmation = ({ onDelete }) => {
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
			<Button sx={{color: 'red'}} onClick={() => setOpen(true)}>
        Delete     
      </Button>	

			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>
					Delete Sprint?
				</DialogTitle>

				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this sprint?
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>

					<Button variant="contained" color="error" onClick={handleDelete} >
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default DeleteConfirmation;
