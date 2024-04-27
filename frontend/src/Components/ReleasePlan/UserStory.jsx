import React, { useState } from "react";
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
	DialogContentText,
	DialogActions,
	Button,
	TextField,
	ToggleButtonGroup,
	ToggleButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const UserStory = ({ storyObject, sprintId }) => {
	console.log(sprintId);
	const [anchorEl, setAnchorEl] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editedText, setEditedText] = useState(
		storyObject.functionalityDescription
	);
	const [editedPoints, setEditedPoints] = useState(storyObject.storyPoints);
	const [userStoryType, setUserStoryType] = useState("story");

	const [role, setRole] = useState(storyObject.userTypes);
	const [functionalityDescription, setFunctionalityDescription] = useState(
		storyObject.functionalityDescription
	);
	const [reasoning, setReasoning] = useState(storyObject.reasoning);
	const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
	const [fullStory, setFullStory] = useState(
		`As a(n) ${role} I want to be able to ${functionalityDescription} so that ${reasoning}.`
	);

	const [tempEditedText, setTempEditedText] = useState(
		storyObject.functionalityDescription
	);
	const [tempEditedPoints, setTempEditedPoints] = useState(
		storyObject.storyPoints
	);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

	function saveEditedStory(sprintId, storyId) {
		var options = {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userTypes: role,
				functionalityDescription: functionalityDescription,
				reasoning: reasoning,
				acceptanceCriteria: acceptanceCriteria,
				storyPoints: editedPoints,
				// priority
			}),
		};
		try {
			console.log(options);
			console.log(sprintId, storyId);
			fetch(
				`http://localhost:8080/api/sprint/${sprintId}/story/${storyId}/edit`,
				options
			).then((result) => {
				if (result.status !== 200) {
					console.log("error", result);
				}
			});
		} catch {
			return null;
		}
	}

	function saveEditedStory(sprintId, storyId) {
		var options = {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userTypes: role,
				functionalityDescription: functionalityDescription,
				reasoning: reasoning,
				acceptanceCriteria: acceptanceCriteria,
				storyPoints: editedPoints,
				// priority
			}),
		};
		try {
			console.log(options);
			console.log(sprintId, storyId);
			fetch(
				`http://localhost:8080/api/sprint/${sprintId}/story/${storyId}/edit`,
				options
			).then((result) => {
				if (result.status !== 200) {
					console.log("error", result);
				}
			});
		} catch {
			return null;
		}
	}

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
		const newFullStory = `As a(n) ${role} I want to be able to ${functionalityDescription} so that ${reasoning}.`;
		// ${acceptanceCriteria}`;
		setFullStory(newFullStory);
		saveEditedStory(sprintId, storyObject.id);
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
		handleDeleteDialogOpen();
	};

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
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
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
						{fullStory}
					</Typography>

					<Typography
						variant="body1"
						textAlign={"right"}
						fontSize={14}
						sx={{ position: "absolute", bottom: 10, right: 12 }}
					>
						{editedPoints} SP
					</Typography>
				</CardContent>
			</Card>

			<Dialog
				open={dialogOpen}
				onClose={handleDialogClose}
				maxWidth="sm"
				fullWidth
			>
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
						value={functionalityDescription}
						onChange={(e) => setFunctionalityDescription(e.target.value)}
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
						value={reasoning}
						onChange={(e) => console.log("setting reasoning", e.target.value) || setReasoning(e.target.value)}
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
						value={editedPoints}
						onChange={(e) => setEditedPoints(e.target.value)}
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
