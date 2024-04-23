import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const UserStory = ({ userStoryText, storyPoints, ...props }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editedText, setEditedText] = useState(userStoryText);
    const [editedPoints, setEditedPoints] = useState(storyPoints);
    const [userStoryType, setUserStoryType] = useState('story');

	const [role, setRole] = useState('');
    const [functionalityDescription, setFunctionalityDescription] = useState('');
    const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
    const [fullStory, setFullStory] = useState(userStoryText);

	const [tempEditedText, setTempEditedText] = useState(userStoryText);
    const [tempEditedPoints, setTempEditedPoints] = useState(storyPoints);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDialogOpen = () => {
		setTempEditedText(editedText);
        setTempEditedPoints(editedPoints);
        setDialogOpen(true);
		handleMenuClose();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleSave = () => {
        setEditedText(tempEditedText);
        setEditedPoints(tempEditedPoints);
		const newFullStory = `As a(n) ${role} I want to be able to ${functionalityDescription}`;
		// so that I ${acceptanceCriteria}`;
		setFullStory(newFullStory);
        handleDialogClose();
		handleMenuClose();
    };

    const handleDelete = () => {
        handleDialogClose();
    };

    return (
        <>
            <Card sx={{ marginBottom: 1, marginRight: 2, position: 'relative', width: 150, height: 200, display:'flex',flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent sx={{ minHeight: 128,maxWidth:150, maxHeight:200,overflowY:'auto'}}>
                    <IconButton
                        aria-label="settings"
                        aria-controls="menu-userstory"
                        aria-haspopup="true"
                        onClick={handleMenuClick}
                        size="large"
                        sx={{ position: 'absolute', bottom: -1, left: 0 }}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="menu-userstory"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleDialogOpen}>Edit</MenuItem>
                        <MenuItem onClick={handleDelete} style={{ color: 'red' }} >Delete</MenuItem>
                    </Menu>
						<Typography variant="body1" textAlign={'left'} fontSize={14} sx={{
							wordWrap: 'break-word',
							overflowWrap: 'break-word',
							maxHeight: 120, 
							marginBottom:1,
							hyphens: 'auto' 
						}} >
							{fullStory}
						</Typography>

						<Typography variant="body1" textAlign={'right'} fontSize={14} sx={{ position: 'absolute', bottom: 10, right: 12 }}>
							{editedPoints} SP
						</Typography>
                </CardContent>
            </Card>

			<Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
				<DialogTitle>Edit:</DialogTitle>
				<DialogContent>
					<ToggleButtonGroup
					color="primary"
					value={userStoryType}
					exclusive
					onChange={(e, newType) => setUserStoryType(newType)}
					aria-label="User story type"
					fullWidth
					sx={{ marginBottom: 2 }}
					>
					<ToggleButton value="story">Story</ToggleButton>
					<ToggleButton value="spike">Spike</ToggleButton>
					<ToggleButton value="infrastructure">Infrastructure</ToggleButton>
					</ToggleButtonGroup>
					
					<Box display="flex" alignItems="center" gap={1} mb={2}>
						<Typography variant="body2" component="span">
							As a(n)
						</Typography>
						<TextField
							size="small"
							label="Role"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							sx={{
							'.MuiInputBase-input': {
								fontSize: '0.875rem', 
								height: 'auto',
								padding: '5px 9px',
							},
							'.MuiInputLabel-root': {
								fontSize: '0.875rem',
							}
							}}
						/>
						<Typography variant="body2" component="span">
							I want to be able to
						</Typography>
					</Box>

					<TextField
					autoFocus
					margin="dense"
					id="functionality-description"
					label="Functionality Description"
					type="text"
					fullWidth
					variant="outlined"
					multiline
					rows={4}
					value={functionalityDescription}
					onChange={(e) => setFunctionalityDescription(e.target.value)}
					sx={{ marginBottom: 2 }}
					/>

					<TextField
					margin="dense"
					id="acceptance-criteria"
					label="Acceptance Criteria"
					type="text"
					fullWidth
					variant="outlined"
					multiline
					rows={4}
					value={acceptanceCriteria}
					onChange={(e) => setAcceptanceCriteria(e.target.value)}
					sx={{ marginBottom: 2 }}
					/>

					<TextField
					margin="dense"
					id="story-points"
					label="Story Points"
					type="number"
					fullWidth
					variant="outlined"
					value={storyPoints}
					onChange={(e) => setEditedPoints(e.target.value)}
					InputProps={{ inputProps: { min: 0 } }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<Button onClick={handleDelete} color="error">Delete</Button>
					<Button onClick={handleSave} color="primary">Save</Button>
				</DialogActions>
				</Dialog>

        </>
    );
};

export default UserStory;
