import React, { useState } from 'react'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, Typography, TextField, MenuItem } from '@mui/material';
import DeleteConfirmation from './DeleteConfirmation'




const SprintOptions = ({ sprints, setSprints, setBacklogItems, index }) => {

  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    handleClose();
  };

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

  const master = [
    {
      value: 'Scrum Master',
      label: 'Scrum Master'
    },
    {
      value: 'bob',
      label: 'bob'
    }


  ];

  return (
    <>
      <IconButton onClick={() => setOpen(true)}>
        <MoreHorizIcon fontSize='medium' />
      </IconButton>

      <Dialog open={open} onClose={handleClose} sx={{ width: '100%' }}>
        <DialogTitle>
          Sprints Options
        </DialogTitle>


        <Box sx={{ paddingLeft: '20px' }}>
          <TextField
            sx={{ width: '300px', paddingBottom: '20px' }}
            id="outlined-select-currency"
            select
            defaultValue="Scrum Master"
          >
            {master.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>

            ))}
          </TextField>
        </Box>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDayjs}>

            <DatePicker
              sx={{ paddingLeft: '20px' }}
              label="Start Date"
              componentsProps={{
                textField: {
                  InputLabelProps: {
                    sx: {
                      paddingLeft: '25px', // Adjust the padding for the label
                    },
                  },
                },
              }}
            />

            <DatePicker
              sx={{ paddingLeft: '20px', paddingRight: '20px' }}
              label="End Date"
              componentsProps={{
                textField: {
                  InputLabelProps: {
                    sx: {
                      paddingLeft: '25px', // Adjust the padding for the label
                      paddingRight: '25px', // Adjust the padding for the label
                    },
                  },
                },
              }}
            />

          </LocalizationProvider>
        </Box>
        <DialogActions>

          <Button>
            Save
          </Button>

          <DeleteConfirmation
            onDelete={() => {
              const sprintId = sprints[index].id;
              deleteSprint(sprintId, index);
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
