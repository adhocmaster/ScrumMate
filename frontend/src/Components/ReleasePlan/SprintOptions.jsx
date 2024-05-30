import React, {useState} from  'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';




const SprintOptions = () => {
    
  const [open, setOpen] = useState(false);

	const handleDelete = () => {
		handleClose();
	};

	const handleClose = () => {
		setOpen(false);
	};

  
	return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <MoreHorizIcon fontSize='medium' />
      </IconButton>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Sprints Options
        </DialogTitle> 

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
        
        label = "Start Date"
        />
        -
        <DatePicker
          label = "End Date"
        />
      </LocalizationProvider>

        <DialogActions>
          
          <Button>
            Save
          </Button>

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

};

export default SprintOptions
