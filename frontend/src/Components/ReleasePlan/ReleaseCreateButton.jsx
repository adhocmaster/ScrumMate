import { useState } from "react";
import {
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	TextField,
	IconButton,
	ToggleButtonGroup,
	ToggleButton,
	Box,
	FormHelperText,
} from "@mui/material";
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { newSprintActionAPI, newSprintStoryAPI } from "../../API/sprint";

export default function ReleaseCreateButton({ releaseId, backlogItems, setBacklogItems, sprints, setSprints, sprintIndex }) {
	const ActionTypeEnum = {
		BUG: 1,
		SYSTEMFEATURE: 2,
		SPIKE: 3,
		INFRASTRUCTURE: 4,
	}

	const [dialogOpen, setDialogOpen] = useState(false);

	const [selectedItem, setSelectedItem] = useState('');
	const [description, setDescription] = useState('');
	const [actionPriority, setActionPriority] = useState('')
	const [selectedItemError, setSelectedItemError] = useState(false);
	const [actionPriorityError, setActionPriorityError] = useState(false);

	const [backlogItemType, setBacklogItemType] = useState('story'); // 'story' or 'action-item'
	const [role, setRole] = useState('');
	const [functionality, setFunctionality] = useState('');
	const [reasoning, setReasoning] = useState('');
	const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
	const [storyPoints, setStoryPoints] = useState(0);
	const [priority, setPriority] = useState(1)

	const openDialogForNewStory = () => {
		if (backlogItemType === 'story') {
			setRole('');
			setFunctionality('');
			setReasoning('');
			setAcceptanceCriteria('');
			setStoryPoints(0);
			setPriority(1);
		} else {
			setSelectedItem('');
			setDescription('');
			setActionPriority('');
			setSelectedItemError(false);
			setActionPriorityError(false);
		}
		setDialogOpen(true);
	};

	const switchFormType = () => {
		setBacklogItemType(backlogItemType === 'story' ? 'action-item' : 'story');
		if (backlogItemType === 'story') {
			setSelectedItem('');
			setDescription('');
			setActionPriority('');
			setSelectedItemError(false);
			setActionPriorityError(false);
			setBacklogItemType('action-item');
		} else {
			setRole('');
			setFunctionality('');
			setReasoning('');
			setAcceptanceCriteria('');
			setStoryPoints(0);
			setPriority(1);
			setBacklogItemType('story');
		}
	};

	const handleDialogClose = () => {
		setDialogOpen(false);

	};

	const handleSelectChange = (event) => {
		setSelectedItem(event.target.value);
		setSelectedItemError(false);
	};

	const handleSelectChangePriority = (event) => {
		setActionPriority(event.target.value);
		setActionPriorityError(false);
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};

	const handleCreate = (sprintId) => {
		const newStory = {
			backlogItemType,
			role,
			functionality,
			reasoning,
			acceptanceCriteria,
			storyPoints,
			priority,
		};
		saveNewStory(newStory, sprintId);
		setDialogOpen(false);
	};

	const handleCreateActionItem = (sprintId) => {
		let hasError = false;

		if (!selectedItem) {
			setSelectedItemError(true);
			hasError = true;
		}

		if (!actionPriority) {
			setActionPriorityError(true);
			hasError = true;
		}
		if (hasError) {
			return;
		}
		const actionItem = {
			selectedItem,
			description,
			actionPriority,
		};
		saveNewActionItem(actionItem, sprintId);
		handleDialogClose();
	}

	const updateSprintsWithAPIResult = (sprintId) => {
		return (response) => {
			const sprintsCopy = [...sprints];
			const indexOfSprint = sprintsCopy.findIndex((sprint) => sprint.id === sprintId);
			sprintsCopy[indexOfSprint].todos.push(response)
			setSprints(sprintsCopy);
		}
	}
	function saveNewActionItem(actionItem, sprintId) {
		newSprintActionAPI(sprintId, actionItem.selectedItem, actionItem.description, actionItem.actionPriority, updateSprintsWithAPIResult(sprintId));
	}

	function saveNewStory(newStory, sprintId) {
		newSprintStoryAPI(sprintId, newStory.role, newStory.functionality, newStory.reasoning,
			newStory.acceptanceCriteria, newStory.priority, updateSprintsWithAPIResult(sprintId)
		);
	}
	return <>
		<IconButton onClick={openDialogForNewStory} color="primary" aria-label="add new story">
			<AddCircleOutlineIcon />
		</IconButton>

		<Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
			{
				backlogItemType === "story" ?
					<>
						<DialogTitle>Add New Story</DialogTitle>
						<DialogContent>
							<ToggleButtonGroup
								color="primary"
								value={backlogItemType}
								exclusive
								// onChange={(e, newType) => setBacklogItemType(newType)}
								onChange={switchFormType}
								aria-label="User story type"
								fullWidth
								sx={{ marginBottom: 2 }}
							>
								<ToggleButton value="story">Story</ToggleButton>
								<ToggleButton value="action-item">Action Item</ToggleButton>
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
									fullWidth
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
								value={functionality}
								onChange={(e) => setFunctionality(e.target.value)}
								sx={{ marginBottom: 2 }}
							/>

							<Typography variant="body2" component="span">
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
								onChange={(e) => setReasoning(e.target.value)}
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

							<FormControl fullWidth>
								<InputLabel id="priority-select-label">Priority</InputLabel>
								<Select
									labelId="priority-select-label"
									id="demo-simple-select"
									value={priority}
									label="Priority"
									onChange={(event) => setPriority(event.target.value)}
								>
									<MenuItem value={4}>High</MenuItem>
									<MenuItem value={3}>Medium</MenuItem>
									<MenuItem value={2}>Low</MenuItem>
									<MenuItem value={1}>None</MenuItem>
								</Select>
							</FormControl>

						</DialogContent>
						<DialogActions>
							<Button onClick={handleDialogClose}>Cancel</Button>
							<Button onClick={() => {
								const sprintId = sprints[sprintIndex].id;
								handleCreate(sprintId);
							}}
								color="primary"
							>
								Create Story
							</Button>
						</DialogActions>
					</>
					:
					<>
						<DialogTitle>Add Action Item</DialogTitle>
						<DialogContent>
							<ToggleButtonGroup
								color="primary"
								value={backlogItemType}
								exclusive
								// onChange={(e, newType) => setBacklogItemType(newType)}
								onChange={switchFormType}
								aria-label="User story type"
								fullWidth
								sx={{ marginBottom: 2 }}
							>
								<ToggleButton value="story">Story</ToggleButton>
								<ToggleButton value="action-item">Action Item</ToggleButton>
							</ToggleButtonGroup>
							<FormControl fullWidth margin="dense">
								<InputLabel id="item-select-label">Item</InputLabel>
								<Select
									labelId="item-select-label"
									id="item-select"
									label="Item"
									value={selectedItem}
									error={selectedItemError}
									onChange={handleSelectChange}
									defaultValue=""
								>
									<MenuItem value={ActionTypeEnum.BUG}>Bug</MenuItem>
									<MenuItem value={ActionTypeEnum.INFRASTRUCTURE}>Infrastructure</MenuItem>
									<MenuItem value={ActionTypeEnum.SYSTEMFEATURE}>System Feature</MenuItem>
									<MenuItem value={ActionTypeEnum.SPIKE}>Spike</MenuItem>
								</Select>
								{selectedItemError && (
									<FormHelperText>Please select an item.</FormHelperText>
								)}
							</FormControl>
							<TextField
								fullWidth
								margin="dense"
								id="action-item-description"
								label="Description"
								type="text"
								variant="outlined"
								multiline
								rows={4}
								value={description}
								onChange={handleDescriptionChange}
							/>

							<FormControl fullWidth sx={{ marginTop: 2 }}>
								<InputLabel id="priority-select-label">Priority</InputLabel>
								<Select
									labelId="priority-select-label"
									id="priority-select"
									value={actionPriority}
									label="Priority"
									onChange={handleSelectChangePriority}
									error={actionPriorityError}
									defaultValue=""
								>
									<MenuItem value={4}>High</MenuItem>
									<MenuItem value={3}>Medium</MenuItem>
									<MenuItem value={2}>Low</MenuItem>
									<MenuItem value={1}>None</MenuItem>
								</Select>
								{actionPriorityError && (
									<FormHelperText>Please select a priority.</FormHelperText>
								)}
							</FormControl>

						</DialogContent>
						<DialogActions>
							<Button onClick={handleDialogClose}>Cancel</Button>
							<Button onClick={() => {
								const sprintId = sprints[sprintIndex].id;
								handleCreateActionItem(sprintId);
							}}
								color="primary"
							>
								Create Action Item
							</Button>
						</DialogActions>
					</>
			}
		</Dialog>
	</>
}