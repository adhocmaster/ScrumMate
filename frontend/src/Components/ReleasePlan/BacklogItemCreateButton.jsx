import { useState } from "react";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	TextField,
	IconButton,
	ToggleButtonGroup,
	ToggleButton,
	FormHelperText,
} from "@mui/material";
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { newSprintActionAPI, newSprintStoryAPI } from "../../API/sprint";
import { newBacklogActionAPI, newBacklogStoryAPI } from "../../API/release";
import StoryEditDialog from "./StoryEditDialog";
import ActionEditDialog from "./ActionEditDialog";

export default function BacklogItemCreateButton({ releaseId, backlogItems, setBacklogItems, sprints, setSprints, sprintIndex }) {
	const source = releaseId ? 'backlog' : 'sprints';

	const [dialogOpen, setDialogOpen] = useState(false);
	const [backlogItemType, setBacklogItemType] = useState('story'); // 'story' or 'action-item'

	const [selectedItem, setSelectedItem] = useState('');
	const [description, setDescription] = useState('');
	const [actionPriority, setActionPriority] = useState('')
	const [selectedItemError, setSelectedItemError] = useState(false);
	const [actionPriorityError, setActionPriorityError] = useState(false);

	const [role, setRole] = useState('');
	const [functionality, setFunctionality] = useState('');
	const [reasoning, setReasoning] = useState('');
	const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
	const [storyPoints, setStoryPoints] = useState(0);
	const [priority, setPriority] = useState(1)

	const openDialog = () => {
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

	const handleCreateActionSprint = () => {
		const sprintId = sprints[sprintIndex].id;
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

		fetchSaveNewActionItemSprint(sprintId);
		handleDialogClose();
	}

	const handleCreateStorySprint = () => {
		const sprintId = sprints[sprintIndex].id;
		fetchSaveNewStorySprint(sprintId);
		setDialogOpen(false);
	};

	const handleCreateActionBacklog = () => {
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

		fetchSaveNewActionBacklog();
		handleDialogClose();
	};

	const handleCreateStoryBacklog = () => {
		fetchSaveNewStoryBacklog();
		setDialogOpen(false);
	};

	const handleCreateAction = source === 'backlog' ? handleCreateActionBacklog : handleCreateActionSprint;
	const handleCreateStory = source === 'backlog' ? handleCreateStoryBacklog : handleCreateStorySprint;

	const updateSprintsWithAPIResult = (sprintId) => {
		return (response) => {
			const sprintsCopy = [...sprints];
			const indexOfSprint = sprintsCopy.findIndex((sprint) => sprint.id === sprintId);
			sprintsCopy[indexOfSprint].todos.push(response)
			setSprints(sprintsCopy);
		}
	}
	function fetchSaveNewActionItemSprint(sprintId) {
		newSprintActionAPI(sprintId, selectedItem, description, actionPriority, updateSprintsWithAPIResult(sprintId));
	}
	function fetchSaveNewStorySprint(sprintId) {
		newSprintStoryAPI(sprintId, role, functionality, reasoning,
			acceptanceCriteria, priority, updateSprintsWithAPIResult(sprintId)
		);
	}

	const updateBacklogWithAPIResult = (response) => {
		const newBacklogItem = [...backlogItems, response];
		setBacklogItems(newBacklogItem);
	}
	function fetchSaveNewActionBacklog() {
		newBacklogActionAPI(releaseId, selectedItem, description, actionPriority, updateBacklogWithAPIResult
		);
	}
	function fetchSaveNewStoryBacklog() {
		newBacklogStoryAPI(releaseId, role, functionality, reasoning,
			acceptanceCriteria, storyPoints, priority, updateBacklogWithAPIResult
		);
	}

	return <>
		<IconButton onClick={openDialog} color="primary" aria-label="add new story">
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
								onChange={switchFormType}
								aria-label="User story type"
								fullWidth
								sx={{ marginBottom: 2 }}
							>
								<ToggleButton value="story">Story</ToggleButton>
								<ToggleButton value="action-item">Action Item</ToggleButton>
							</ToggleButtonGroup>

							<StoryEditDialog
								role={role}
								setRole={setRole}
								functionality={functionality}
								setFunctionality={setFunctionality}
								reasoning={reasoning}
								setReasoning={setReasoning}
								acceptanceCriteria={acceptanceCriteria}
								setAcceptanceCriteria={setAcceptanceCriteria}
								priority={priority}
								setPriority={setPriority}
							/>

						</DialogContent>
						<DialogActions>
							<Button onClick={handleDialogClose}>Cancel</Button>
							<Button onClick={handleCreateStory}
								color="primary"
								variant="contained"
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

							<ActionEditDialog
								selectedItem={selectedItem}
								setSelectedItem={setSelectedItem}
								description={description}
								setDescription={setDescription}
								actionPriority={actionPriority}
								setActionPriority={setActionPriority}
								selectedItemError={selectedItemError}
								setSelectedItemError={setSelectedItemError}
								actionPriorityError={actionPriorityError}
								setActionPriorityError={setActionPriorityError}
							/>

						</DialogContent>
						<DialogActions>
							<Button onClick={handleDialogClose}>Cancel</Button>
							<Button onClick={handleCreateAction}
								color="primary"
								variant="contained"
							>
								Create Action Item
							</Button>
						</DialogActions>
					</>
			}
		</Dialog>
	</>
}