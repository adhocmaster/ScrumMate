import React, { useState } from "react";
import {
	Card, CardContent, Box, Typography, IconButton, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, ToggleButtonGroup, ToggleButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const UserStory = ({ storyObject, deleteFunction, sprints, setSprints }) => {
	const [anchorOpen, setAnchorOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

	const [backlogItemType, setBacklogItemType] = useState("story");
	const [role, setRole] = useState(storyObject.userTypes);
	const [functionality, setFunctionality] = useState(storyObject.functionalityDescription);
	const [reasoning, setReasoning] = useState(storyObject.reasoning);
	const [acceptanceCriteria, setAcceptanceCriteria] = useState(storyObject.acceptanceCriteria);
	const [storyPoints, setStoryPoints] = useState(storyObject.storyPoints);

	const [tempBacklogItemType, setTempBacklogItemType] = useState(backlogItemType);
	const [tempRole, setTempRole] = useState(role);
	const [tempFunctionality, setTempFunctionality] = useState(functionality);
	const [tempReasoning, setTempReasoning] = useState(reasoning);
	const [tempAcceptanceCriteria, setTempAcceptanceCriteria] = useState(acceptanceCriteria);
	const [tempStoryPoints, setTempStoryPoints] = useState(storyPoints);

	const handleMenuClick = (event) => {
		setAnchorOpen(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorOpen(false);
	};

	const handleDialogOpen = () => {
		setTempBacklogItemType(backlogItemType)
		setTempRole(role)
		setTempFunctionality(functionality)
		setTempReasoning(reasoning)
		setTempAcceptanceCriteria(acceptanceCriteria)
		setTempStoryPoints(storyPoints)
		setEditDialogOpen(true);
		handleMenuClose();
	};

	const handleDialogClose = () => {
		setEditDialogOpen(false);
	};

	const handleSave = () => {
		setBacklogItemType(tempBacklogItemType);
		setRole(tempRole);
		setFunctionality(tempFunctionality);
		setReasoning(tempReasoning);
		setAcceptanceCriteria(tempAcceptanceCriteria);
		setStoryPoints(tempStoryPoints);

		saveEditedStory(storyObject.id);
		handleDialogClose();
		handleMenuClose();
	};

	const handleDeleteDialogOpen = () => {
		handleMenuClose();
		setDeleteDialogOpen(true)
	}

	const handleDeleteDialogClose = () => {
		setDeleteDialogOpen(false)
	}

	const handleDelete = () => {
		handleDialogClose();
		deleteFunction(storyObject.id)
	};

	function saveEditedStory(storyId) {
		var newStoryObj = {
			userTypes: tempRole,
			functionalityDescription: tempFunctionality,
			reasoning: tempReasoning,
			acceptanceCriteria: tempAcceptanceCriteria,
			storyPoints: tempStoryPoints,
		}
		var sprintNumber = sprints.find(sprint => sprint.todos.some(todo => todo.id === storyId))?.sprintNumber;

		var options = {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				// change type?
				userTypes: tempRole,
				functionalityDescription: tempFunctionality,
				reasoning: tempReasoning,
				acceptanceCriteria: tempAcceptanceCriteria,
				storyPoints: tempStoryPoints,
				// priority?
			}),
		};

		try {
			fetch(
				`http://localhost:8080/api/story/${storyId}/edit`,
				options
			).then((result) => {
				setStoryWrapper(newStoryObj, sprintNumber, storyId)
				if (result.status !== 200) {
					console.log("error", result);
				}
			});
		} catch {
			return null;
		}
	}

	function setStoryWrapper(newStoryObj, sprintNumber, storyId) {
		const sprintsCopy = [...sprints];
		const sprintIndex = sprintsCopy.findIndex(sprint => sprint.sprintNumber === sprintNumber);
		const storyIndex = sprintsCopy[sprintIndex].todos.findIndex(story => story.id === storyId);
		sprintsCopy[sprintIndex].todos[storyIndex] = { ...sprintsCopy[sprintIndex].todos[storyIndex], ...newStoryObj };
		console.log(sprintsCopy)
		setSprints(sprintsCopy);
	}
	
	  	  

	return (
		<>
			<Card
				sx={{
					marginBottom: 1,
					marginRight: 2,
					position: "relative",
					width: 150,
					height: 200,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
				}}
			>
				<CardContent
					sx={{
						minHeight: 128,
						maxWidth: 150,
						maxHeight: 200,
						overflowY: "auto",
					}}
				>
					<IconButton
						aria-label="settings"
						aria-controls="menu-userstory"
						aria-haspopup="true"
						onClick={handleMenuClick}
						size="large"
						sx={{ position: "absolute", bottom: -1, left: 0 }}
					>
						<MoreVertIcon />
					</IconButton>
					<Menu
						id="menu-userstory"
						anchorEl={anchorOpen}
						keepMounted
						open={anchorOpen}
						onClose={handleMenuClose}
					>
						<MenuItem onClick={handleDialogOpen}>Edit</MenuItem>
						<MenuItem onClick={handleDeleteDialogOpen} style={{ color: "red" }}>
							Delete
						</MenuItem>
					</Menu>
					<Typography
						variant="body1"
						textAlign={"left"}
						fontSize={14}
						sx={{
							wordWrap: "break-word",
							overflowWrap: "break-word",
							maxHeight: 120,
							marginBottom: 1,
							hyphens: "auto",
						}}
					>
						{`As a(n) ${role} I want to be able to ${functionality} so that ${reasoning}.`}
					</Typography>

					<Typography
						variant="body1"
						textAlign={"right"}
						fontSize={14}
						sx={{ position: "absolute", bottom: 10, right: 12 }}
					>
						{storyPoints} SP
					</Typography>
				</CardContent>
			</Card>

			<Dialog
				open={editDialogOpen}
				onClose={handleDialogClose}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Edit:</DialogTitle>
				<DialogContent>
					<ToggleButtonGroup
						color="primary"
						value={tempBacklogItemType}
						exclusive
						onChange={(e, newType) => setTempBacklogItemType(newType)}
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
							value={tempRole}
							onChange={(e) => setTempRole(e.target.value)}
							sx={{
								".MuiInputBase-input": {
									fontSize: "0.875rem",
									height: "auto",
									padding: "5px 9px",
								},
								".MuiInputLabel-root": {
									fontSize: "0.875rem",
								},
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
						value={tempFunctionality}
						onChange={(e) => setTempFunctionality(e.target.value)}
						sx={{ marginBottom: 2 }}
					/>

					<Typography variant="body2" component="span" >
						so that
					</Typography>

					<TextField
						margin="dense"
						id="reasoning"
						label="Reasoning"
						type="text"
						fullWidth
						variant="outlined"
						multiline
						rows={4}
						value={tempReasoning}
						onChange={(e) => setTempReasoning(e.target.value)}
						sx={{ marginBottom: 2, marginTop: 2 }}
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
						value={tempAcceptanceCriteria}
						onChange={(e) => setTempAcceptanceCriteria(e.target.value)}
						sx={{ marginBottom: 2 }}
					/>

					<TextField
						margin="dense"
						id="story-points"
						label="Story Points"
						type="number"
						fullWidth
						variant="outlined"
						value={tempStoryPoints}
						onChange={(e) => setTempStoryPoints(e.target.value)}
						InputProps={{ inputProps: { min: 0 } }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<Button onClick={handleDeleteDialogOpen} color="error">
						Delete
					</Button>
					<Button onClick={handleSave} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose}>
				<DialogTitle>
					Delete backlog item?
				</DialogTitle>

				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this backlog item?
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleDeleteDialogClose} color="primary">
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

export default UserStory;
