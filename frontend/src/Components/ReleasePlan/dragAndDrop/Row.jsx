import React, { useState } from 'react';
import styled from '@xstyled/styled-components';
import { colors } from '@atlaskit/theme';
import { Draggable } from 'react-beautiful-dnd';
import QuoteList from '../styles/list';
import Title from '../styles/title';

import { Box, Grid, Divider, Typography, Paper, List, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, ToggleButtonGroup, ToggleButton, IconButton, FormHelperText } from '@mui/material';
import DeleteConfirmation from "../DeleteConfirmation";
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const grid = 8;
const borderRadius = 2;

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: row;
  min-width: 100px;
  min-height: 252px;
  width: 100%; // Ensure it takes the full width
  flex-grow: 1; // Allow it to grow
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: ${borderRadius}px;
  border-top-right-radius: ${borderRadius}px;
  background-color: ${({ isDragging }) =>
		isDragging ? colors.G50 : colors.N30};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${colors.G50};
  }
  width: 100;
`;


const Row = (props) => {
	const ActionTypeEnum = {
		BUG: 1,
		SYSTEMFEATURE: 2,
		SPIKE: 3,
		INFRASTRUCTURE: 4,
	}

	const title = props.title;
	const quotes = props.quotes;
	const index = props.index;
	const lockPage = props.lockPage;
	const sprints = props.sprints;
	const setSprints = props.setSprints;
	const deleteStory = props.deleteStory;
	const setBacklogItems = props.setBacklogItems;
	const releaseId = props.releaseId;
	// console.log("rendering row", index)
	// console.log("quotes", quotes)

	const [dialogOpen, setDialogOpen] = useState(false);

	const [selectedItem, setSelectedItem] = useState('');
	const [description, setDescription] = useState('');
<<<<<<< HEAD
	const [actionPriority, setActionPriority] = useState('')
	const [selectedItemError, setSelectedItemError] = useState(false);
	const [actionPriorityError, setActionPriorityError] = useState(false);
=======
	const [actionPriority, setActionPriority] = useState(1)
>>>>>>> c8e767330ecfe79d2dcf16d9e18762c572b30214

	const [backlogItemType, setBacklogItemType] = useState('story'); // 'story' or 'action-item'
	const [role, setRole] = useState('');
	const [functionality, setFunctionality] = useState('');
	const [reasoning, setReasoning] = useState('');
	const [acceptanceCriteria, setAcceptanceCriteria] = useState('');
	const [storyPoints, setStoryPoints] = useState(0);
	const [priority, setPriority] = useState(1)

	const openDialogForNewStory = () => {
		setBacklogItemType('story');
		setRole('');
		setFunctionality('');
		setReasoning('');
		setAcceptanceCriteria('');
		setStoryPoints(0);
		setPriority(1);

		setSelectedItem('')
		setDescription('')
		setActionPriority(0)

		setDialogOpen(true);
		setBacklogItemType('story');
	};

	const openDialogForNewActionItem = () => {
		setSelectedItem('');
		setDescription('');
		setActionPriority('');
		setSelectedItemError(false);
		setActionPriorityError(false);
		setBacklogItemType('action-item');
		setDialogOpen(true);
	  };

	const switchFormType = () => {
		setBacklogItemType(backlogItemType === 'story' ? 'action-item' : 'story');
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

	function saveNewActionItem(actionItem, sprintId) {
		var options = {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				actionType: actionItem.selectedItem,
				description: actionItem.description,
				priority: actionItem.actionPriority,
				storyPoints: 0,
			}),
		};

		try {
			fetch(
				`http://localhost:8080/api/sprint/${sprintId}/action`,
				options
			).then((result) => {
				if (result.status !== 200) {
					console.log("error", result);
				}
				result.json().then((jsonResult) => {
					console.log(jsonResult.name)
					const sprintsCopy = [...sprints];
					const indexOfSprint = sprintsCopy.findIndex((sprint) => sprint.id === sprintId);
					sprintsCopy[indexOfSprint].todos.push(jsonResult)
					setSprints(sprintsCopy);
				})
			});
		} catch {
			return null;
		}
	}



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
				priority: newStory.priority
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
				result.json().then((jsonResult) => {
					const sprintsCopy = [...sprints];
					const indexOfSprint = sprintsCopy.findIndex((sprint) => sprint.id === sprintId);
					sprintsCopy[indexOfSprint].todos.push(jsonResult)
					setSprints(sprintsCopy);
				})
			});
		} catch {
			return null;
		}
	}

	const deleteSprint = (sprintId, index) => {
		fetch(`http://localhost:8080/api/sprint/${sprintId}`, {
			method: "DELETE",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		})
			.then((response) => {
				response.json().then(jsonResult => {
					console.log(jsonResult)
					setSprints(jsonResult[0])
					setBacklogItems(jsonResult[1])
				})
			})
			.catch((error) => console.log("error deleting sprint:"));
	};

	return (
		<>
			<Draggable draggableId={title} index={index} direction="horizontal" isDragDisabled={lockPage}>
				{(provided, snapshot) => (
					<Container ref={provided.innerRef} {...provided.draggableProps}>
						<Header isDragging={snapshot.isDragging}>
							<Title
								isDragging={snapshot.isDragging}
								{...provided.dragHandleProps}
								aria-label={`${title} quote list`}
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
											{`Sprint ${index + 1}`}
										</Typography>
										<DeleteConfirmation
											onDelete={() => {
												const sprintId = sprints[index].id;
												deleteSprint(sprintId, index);
											}}
										/>
										<IconButton onClick={openDialogForNewStory} color="primary" aria-label="add new story">
											<AddIcon />
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

															{/* <TextField
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
																/> */}

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
																const sprintId = sprints[index].id;
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
																const sprintId = sprints[index].id;
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
										<Typography sx={{ marginBottom: 2 }} fontSize={14}>
											{quotes.reduce((accumulator, todo) => accumulator + todo.size, 0)} SP
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
							</Title>
						</Header>
						<QuoteList
							listId={title}
							listType="QUOTE"
							style={{
								backgroundColor: snapshot.isDragging ? colors.G50 : null,
							}}
							quotes={quotes}
							internalScroll={props.isScrollable}
							isCombineEnabled={Boolean(props.isCombineEnabled)}
							useClone={Boolean(props.useClone)}
							lockPage={lockPage}
							sprints={sprints}
							setSprints={setSprints}
							sprintIndex={index}
							deleteStory={deleteStory}
						/>
					</Container >
				)
				}
			</Draggable >
		</>
	);
};

export default Row;