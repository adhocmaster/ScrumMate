import { useEffect, useState } from "react";
import {
	Card,
	CardContent,
	Input,
	List,
	ListItem,
	Paper,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	IconButton,
	ToggleButtonGroup,
	ToggleButton,
	Box,
} from "@mui/material";
import UserStory from "./UserStory";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Backlog = ({ releaseId }) => {
	const [backlogItems, setBacklogItems] = useState([]);

	const [backlogItemType, setBacklogItemType] = useState("story");
	const [role, setRole] = useState("");
	const [functionality, setFunctionality] = useState("");
	const [reasoning, setReasoning] = useState("");
	const [acceptanceCriteria, setAcceptanceCriteria] = useState("");
	const [storyPoints, setStoryPoints] = useState(0);

	const [dialogOpen, setDialogOpen] = useState(false);

	const openDialogForNewStory = () => {
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handleAddBacklogItem = () => {
		fetchCreateBacklogItem();
		handleDialogClose();
	};

	const onDragEnd = (result) => {
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		const items = Array.from(backlogItems);
		const [reorderedItem] = items.splice(source.index, 1);
		items.splice(destination.index, 0, reorderedItem);

		setBacklogItems(items);
	};

	function fetchCreateBacklogItem() {
		var options = {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				// change type?
				userTypes: role,
				functionalityDescription: functionality,
				reasoning: reasoning,
				acceptanceCriteria: acceptanceCriteria,
				storyPoints: storyPoints,
				priority: 1,
			}),
		};
		try {
			fetch(`http://localhost:8080/api/release/${releaseId}`, options).then(
				(result) => {
					if (result.status === 200) {
						result.json().then((response) => {
							console.log(releaseId);
							console.log(response);
							const newBacklogItem = [...backlogItems, response];
							setBacklogItems(newBacklogItem);
						});
					} else {
						setBacklogItems(backlogItems);
					}
					setRole("");
					setFunctionality("");
					setReasoning("");
					setAcceptanceCriteria("");
					setStoryPoints(0);
				}
			);
		} catch { }
	}

	function fetchDeleteStory(storyId) {
		// TODO: find index and remove it and do setstate again
		fetch(`http://localhost:8080/api/backlogItem/${storyId}/delete`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		})
			.then((response) => response.json())
			.then((result) => {
				setBacklogItems(result);
			})
			.catch((error) => console.log("error deleting story"));
	}

	function fetchBacklog() {
		var options = {
			method: "get",
			credentials: "include",
		};
		try {
			fetch(
				`http://localhost:8080/api/release/${releaseId}/backlog`,
				options
			).then((result) => {
				if (result.status === 200) {
					result.json().then((response) => {
						console.log(releaseId);
						console.log(response);
						setBacklogItems(response.backlog);
					});
				} else {
					setBacklogItems([]);
				}
			});
		} catch { }
	}

	useEffect(() => {
		fetchBacklog();
	}, [releaseId]);

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Typography
				variant="h6"
				marginLeft={2}
				textAlign={"left"}
				fontWeight="bold"
				fontSize={14}
			>
				Backlog
				<IconButton onClick={openDialogForNewStory} aria-label="add new story">
					<AddCircleOutlineIcon fontSize="small" />
				</IconButton>
			</Typography>
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
						onChange={(e, newType) => setBacklogItemType(newType)}
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

					<TextField
						margin="dense"
						id="story-points"
						label="Story Points"
						type="number"
						fullWidth
						variant="outlined"
						value={storyPoints}
						onChange={(e) => {
							if (!isNaN(e.target.value) && e.target.value.trim() !== "") {
								setStoryPoints(e.target.value);
							}
						}}
						InputProps={{
							inputProps: {
								min: 0, // Minimum value
							},
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose}>Cancel</Button>
					<Button onClick={handleAddBacklogItem} color="primary">
						Create Story
					</Button>
				</DialogActions>
			</Dialog>

			<Droppable droppableId="backlogDroppable">
				{(provided) => (
					<Paper
						sx={{
							marginLeft: 2,
							backgroundColor: "lightgray",
						}}
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						<List>
							{backlogItems.map((item, index) => (
								<Draggable
									key={item.id}
									draggableId={String(item.id)}
									index={index}
								>
									{(provided) => (
										<ListItem
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<UserStory
												storyObject={item}
												deleteFunction={fetchDeleteStory}
												backlog={backlogItems}
											/>
										</ListItem>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</List>
					</Paper>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default Backlog;
