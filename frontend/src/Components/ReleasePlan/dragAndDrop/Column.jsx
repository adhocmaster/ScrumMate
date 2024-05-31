import React, { useState } from "react";
import styled from "@xstyled/styled-components";
import { colors } from "@atlaskit/theme";
import { Draggable } from "react-beautiful-dnd";
import QuoteList from "../styles/verticalList";
import Title from "../styles/title";
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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';

const grid = 8;
const borderRadius = 2;

const Container = styled.div`
  margin: ${grid}px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  height: 0px;
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
`;

const Column = (props) => {
	const title = props.title;
	const quotes = props.quotes;
	const index = props.index;
	const lockPage = props.lockPage;
	const backlogItems = props.backlogItems;
	const setBacklogItems = props.setBacklogItems;
	const deleteStory = props.deleteStory;
	const releaseId = props.releaseId;

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
				priority: priority,
			}),
		};
		try {
			fetch(`http://localhost:8080/api/release/${releaseId}`, options).then(
				(result) => {
					if (result.status === 200) {
						result.json().then((response) => {
							const newBacklogItem = [...backlogItems, response];
							setBacklogItems(newBacklogItem);
						});
					} else {
						setBacklogItems(backlogItems);
					}
					setBacklogItemType("story");
					setRole("");
					setFunctionality("");
					setReasoning("");
					setAcceptanceCriteria("");
					setStoryPoints(0);
					setPriority(1);
				}
			);
		} catch { }
	}

	return (
		<>
			<Typography
				variant="h6"
				marginLeft={2}
				textAlign={"left"}
				fontWeight="bold"
				fontSize={14}
			>
				Backlog
				{
					lockPage ?
						<></> :
						<IconButton onClick={openDialogForNewStory} aria-label="add new story">
							<AddCircleOutlineIcon fontSize="small" />
						</IconButton>
				}
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

					{/* <TextField
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

			<Draggable draggableId={title} index={index} isDragDisabled={true}>
				{(provided, snapshot) => (
					<Container ref={provided.innerRef} {...provided.draggableProps}>
						<Header isDragging={snapshot.isDragging}>
							<Title
								isDragging={snapshot.isDragging}
								{...provided.dragHandleProps}
								aria-label={`${title} quote list`}
							>
							</Title>
						</Header>
						<QuoteList
							listId={title}
							listType="QUOTE"
							style={{
								backgroundColor: snapshot.isDragging ? colors.G50 : null
							}}
							quotes={quotes}
							internalScroll={props.isScrollable}
							isCombineEnabled={Boolean(props.isCombineEnabled)}
							useClone={Boolean(props.useClone)}
							lockPage={lockPage}
							backlog={backlogItems}
							deleteStory={deleteStory}
						/>
					</Container>
				)}
			</Draggable>
		</>
	);
};

export default Column;
