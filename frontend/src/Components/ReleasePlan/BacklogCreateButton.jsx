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
} from "@mui/material";
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { newBacklogStoryAPI } from "../../API/release";

export default function BacklogCreateButton({ releaseId, backlogItems, setBacklogItems }) {
	const [backlogItemType, setBacklogItemType] = useState("story");
	const [role, setRole] = useState("");
	const [functionality, setFunctionality] = useState("");
	const [reasoning, setReasoning] = useState("");
	const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
	const [storyPoints, setStoryPoints] = useState(0);
	const [priority, setPriority] = useState(1)

	const [dialogOpen, setDialogOpen] = useState(false);
	const [actionDialogOpen, setActionDialogOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState('');
	const [description, setDescription] = useState('');

	const openDialogForNewStory = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setActionDialogOpen(false);
	};

	const openDialogForActionItems = () => {
		setDialogOpen(false);
		setActionDialogOpen(true);
	};

	const handleSelectChange = (event) => {
		setSelectedItem(event.target.value);
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};

	const handleAddBacklogItem = () => {
		fetchCreateBacklogItem();
		handleDialogClose();
	};

	function fetchCreateBacklogItem() {
		const resultSuccessHandler = (response) => {
			const newBacklogItem = [...backlogItems, response];
			setBacklogItems(newBacklogItem);
		}
		const resultFailureHandler = (response) => {
			setBacklogItems(backlogItems);
		}
		newBacklogStoryAPI(releaseId, role, functionality, reasoning,
			acceptanceCriteria, storyPoints, priority, resultSuccessHandler, resultFailureHandler
		);
		setBacklogItemType("story");
		setRole("");
		setFunctionality("");
		setReasoning("");
		setAcceptanceCriteria("");
		setStoryPoints(0);
		setPriority(1);
	}

	return <>
		<IconButton onClick={openDialogForNewStory} aria-label="add new story">
			<AddCircleOutlineIcon fontSize="small" />
		</IconButton>

		<Dialog
			open={dialogOpen}
			onClose={handleDialogClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle>Add New Story</DialogTitle>
			<DialogContent>
				<ToggleButtonGroup
					color="primary"
					value={backlogItemType}
					exclusive
					// onChange={(e, newType) => setBacklogItemType(newType)}
					onChange={(e, newType) => {
						newType === 'story' ? openDialogForNewStory() : openDialogForActionItems();
					}}
					aria-label="User story type"
					fullWidth
					sx={{ marginBottom: 2 }}
				>
					<ToggleButton value="story">Story</ToggleButton>
					<ToggleButton value="action=items">Action Items</ToggleButton>
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
				<Button onClick={handleAddBacklogItem} color="primary">
					Create Story
				</Button>
			</DialogActions>
		</Dialog>

		<Dialog open={actionDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
			<DialogTitle>Add Action Item</DialogTitle>
			<DialogContent>
				<FormControl fullWidth margin="dense">
					<InputLabel id="item-select-label">Item</InputLabel>
					<Select
						labelId="item-select-label"
						id="item-select"
						label="Item"
						value={selectedItem}
						onChange={handleSelectChange}
						defaultValue=""
					>
						<MenuItem value="bug">Bug</MenuItem>
						<MenuItem value="infrastructure">Infrastructure</MenuItem>
						<MenuItem value="system-feature">System Feature</MenuItem>
						<MenuItem value="spike">Spike</MenuItem>
					</Select>
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
			</DialogContent>
			<DialogActions>
				<Button onClick={handleDialogClose}>Cancel</Button>
				<Button onClick={handleDialogClose}>Create Action Item</Button>
			</DialogActions>
		</Dialog>
	</>
}