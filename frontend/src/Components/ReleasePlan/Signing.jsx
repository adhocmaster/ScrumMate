import React, { useEffect, useState } from 'react'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import {
    Drawer, IconButton, Typography, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemText,
    ListItem, ListItemIcon, Avatar, Box, List, Button
} from "@mui/material";

import RestoreIcon from '@mui/icons-material/Restore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const Signing = ({ projectId }) => {

    const [open, setOpen] = useState(false);
    const [signed, isSigned] = useState(false);
    const [users, setUserList] = useState([[], { username: "loading..." }, []]);

    function fetchUserList() {
        var options = {
            method: 'get',
            credentials: 'include'
        }
        try {
            fetch(`http://localhost:8080/api/project/${projectId}/getMembers`, options).then((result) => {
                if (result.status === 200) {
                    result.json().then((response) => {
                        setUserList(response);
                    })
                }
            })
        }
        catch {
            return;
        }
    };

    const handleClickOpen = () => {
        fetchUserList(projectId)
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    }

    const handleSignInClick = () => {
        isSigned(true);
    }

    return (

        <>
            <IconButton onClick={() => handleClickOpen()}>
                <HistoryEduIcon />
            </IconButton>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

                <Dialog open={open} onClose={handleClickClose}>
                    <DialogTitle>
                        Signatures
                    </DialogTitle>
                    <List sx={{ width: '600px', bgcolor: 'background.paper' }}>

                        <ListItem>
                            <ListItemIcon>
                                <Avatar>PO</Avatar>
                            </ListItemIcon>
                            <ListItemText primary={users[1].username} />
                            <ListItemIcon>
                                {signed ? <CheckCircleIcon sx={{ color: 'green' }} fontSize='large' /> : <RestoreIcon fontSize="large" />}
                            </ListItemIcon>
                        </ListItem>
                    </List>
                    <Box sx={{ padding: '16px 10px' }} onClick={() => handleSignInClick()}>
                        <Button variant="contained" color="primary" fullWidth>
                            Sign Release Plan
                        </Button>
                    </Box>
                </Dialog >
            </Box >
        </>

    )
}
