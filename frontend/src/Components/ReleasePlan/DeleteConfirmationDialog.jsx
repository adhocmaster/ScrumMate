import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function DeleteConfirmationDialog({ open, handleClose, handleDelete, type }) {
	return <Dialog open={open} onClose={handleClose}>
		<DialogTitle>
			Deleteing {type}?
		</DialogTitle>

		<DialogContent>
			<DialogContentText>
				Are you sure you want to delete this {type}?
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
}