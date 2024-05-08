import React, { useEffect, useState } from 'react'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import { Drawer, IconButton, Typography, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, ListItemText } from "@mui/material";

export const Signing = (projectId) => {

    const [open, setOpen] = useState(false);
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

    useEffect(() => {

        fetchUserList(projectId);
    });

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickClose = () => {
        setOpen(false);
    }

    return (

        <>
            <IconButton onClick={() => handleClickOpen()}>
                <HistoryEduIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClickClose}>
                <DialogTitle>
                    Signatures
                </DialogTitle>

                <>
                    <DialogContentText>
                    </DialogContentText>
                </>


            </Dialog>
        </>

    )
}
