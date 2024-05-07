import { useState } from "react";
import { Box, Divider, Typography, Paper, List, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, ToggleButtonGroup, ToggleButton, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import UserStory from "./UserStory";
import DeleteConfirmation from "./DeleteConfirmation";

const Sprint = ({ index, items, setItems, userStories }) => {
	const [stories, setStories] = useState(userStories);
	const [dialogOpen, setDialogOpen] = useState(false);

	const [backlogItemType, setBacklogItemType] = useState('story');
	const [role, setRole] = useState('');
	const [functionality, setFunctionality] = useState('');
	const [reasoning, setReasoning] = useState('');
	const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
	const [storyPoints, setStoryPoints] = useState(0);


	// Function to handle the reordering of stories (content within the cards).
	function reorderStories(result) {
		const startIndex = result.source.index;
		const endIndex = result.destination.index;

		setStories((stories) => {
			const nums = [...stories];
			const [removed] = nums.splice(startIndex, 1);
			nums.splice(endIndex, 0, removed);
			return nums;
		});
	}

	const deleteSprint = (sprintId, index) => {
		fetch(`http://localhost:8080/api/sprint/${sprintId}`, {
			method: "DELETE",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		}).catch((error) => console.log("error deleting sprint:"));
		const updatedSprints = items.filter((_, i) => index !== i);
		setItems(updatedSprints);
	};

	const deleteStory = (storyId) => {
		// TODO: find index and remove it and do setstate again
		fetch(`http://localhost:8080/api/backlogItem/${storyId}/delete`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		})
			.then((response) => response.json())
			.then((result) => {
				setStories(result)
			}).catch((error) => console.log("error deleting story"));
	};

	const onDragEnd = (result) => {
		if (!result.destination) return;
		const newList = Array.from(userStories);
		const [removed] = newList.splice(result.source.index, 1);
		newList.splice(result.destination.index, 0, removed);
		setItems((prevItems) =>
			prevItems.map((item, idx) =>
				idx === index ? { ...item, userStories: newList } : item
			)
		);
	};

	//for + popup
	const openDialogForNewStory = () => {
		setBacklogItemType('story');
		setRole('');
		setFunctionality('');
		setReasoning('');
		setAcceptanceCriteria('');
		setStoryPoints(0);
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
	};

	const handleCreate = (sprintId) => {
		const newStory = {
			backlogItemType,
			role,
			functionality,
			reasoning,
			acceptanceCriteria,
			storyPoints,
		};
		console.log('Creating new story:', newStory);
		saveNewStory(newStory, sprintId);
		setDialogOpen(false);
	};

	function saveNewStory(newStory, sprintId) {
		var options = {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				// change type?
				userTypes: newStory.role,
				functionalityDescription: newStory.functionality,
				reasoning: newStory.reasoning,
				acceptanceCriteria: newStory.acceptanceCriteria,
				storyPoints: newStory.storyPoints,
				priority: 1
				// priority?
			}),
		};

		try {
			fetch(
				`http://localhost:8080/api/sprint/${sprintId}`,
				options
			).then((result) => {
				if (result.status !== 200) {
					console.log("error", result);
				}
				console.log(items)
				result.json().then((jsonResult) => {
					console.log(jsonResult)
					const sprintsCopy = [...items];
					const indexOfSprint = sprintsCopy.findIndex((sprint) => sprint.id === sprintId);
					console.log(indexOfSprint)
					console.log(sprintsCopy[indexOfSprint])
					sprintsCopy[indexOfSprint].todos.push(jsonResult)
					setItems(sprintsCopy);
				})
			});
		} catch {
			return null;
		}
	}


	return (
		<DragDropContext onDragEnd={reorderStories}>
			<Droppable droppableId={`droppable-${index}`} direction="horizontal">
				{(provided) => (
					<Box
						sx={{
							display: "flex",
							marginLeft: 2,
							marginBottom: 2,
							backgroundColor: "lightgray",
						}}
					>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									justifyContent: "space-between",
									alignItems: "center",
									height: "100%",
									marginLeft: 2,
								}}
							>
								<Typography sx={{ marginTop: 2 }} fontSize={14}>
									{index + 1}
								</Typography>
								<DeleteConfirmation
									onDelete={() => {
										const sprintId = items[index].id;
										deleteSprint(sprintId, index);
									}}
								/>
								<IconButton onClick={openDialogForNewStory} color="primary" aria-label="add new story">
									<AddIcon />
								</IconButton>
								<Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
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
											  // Check if the entered value is a number and is not empty
											  if (!isNaN(e.target.value) && e.target.value.trim() !== '') {
												setStoryPoints(e.target.value);
											  }
											}}
											InputProps={{
											  inputProps: {
												min: 0 // Minimum value
											  }
											}}
										/>
									</DialogContent>
									<DialogActions>
										<Button onClick={handleDialogClose}>Cancel</Button>
										<Button onClick={() => {
											const sprintId = items[index].id;
											handleCreate(sprintId);
										}}
											color="primary"
										>
											Create Story
										</Button>
									</DialogActions>
								</Dialog>

								<Typography sx={{ marginBottom: 2 }} fontSize={14}>
									8
								</Typography>
							</Box>
							<Box sx={{ height: "100%" }}>
								<Divider
									orientation="vertical"
									sx={{
										marginTop: "10px",
										marginLeft: "12px",
										backgroundColor: "rgba(0, 0, 0, 0.5)",
										width: "1.5px",
										height: "88%",
									}}
								/>
							</Box>
						</Box>

						<Paper sx={{ backgroundColor: "lightgray", overflowX: "auto" }}>
							<List
								ref={provided.innerRef}
								{...provided.droppableProps}
								sx={{ display: "flex", flexDirection: "row" }}
							>
								{stories.map((storyObj, idx) => (
									<Draggable
										key={storyObj.id}
										draggableId={storyObj.id.toString()}
										index={storyObj.rank}
									>
										{(provided) =>
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												sx={{
													minWidth: 200,
													display: "inline-block",
													padding: "8px 0px 8px 12px",
												}}
											>
												<UserStory
													storyObject={storyObj}
													deleteFunction={deleteStory}
												/>
											</div>
										}
									</Draggable>
								))}

								{provided.placeholder}
							</List>
						</Paper>
					</Box>
				)}
			</Droppable>
		</DragDropContext>
	);
};

export default Sprint;
