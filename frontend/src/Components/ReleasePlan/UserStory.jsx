import React, { useEffect, useState } from "react";
import {
	Card, CardContent, Box, Typography, IconButton, Menu, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField, ToggleButtonGroup, ToggleButton, Grid, Divider, List, ListItem, ListItemIcon, Avatar, ListItemText, Slider
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import NextPlanOutlinedIcon from '@mui/icons-material/NextPlanOutlined';

const UserStory = ({ storyObject, deleteFunction, sprints, setSprints, sprintNumber, backlog }) => {
	const [anchorOpen, setAnchorOpen] = useState(false);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [pokerDialogOpen, setPokerDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const [showAcceptanceCriteria, setShowAcceptanceCriteria] = useState(false);

	const [backlogItemType, setBacklogItemType] = useState("story");
	const [role, setRole] = useState(storyObject.userTypes);
	const [functionality, setFunctionality] = useState(storyObject.functionalityDescription);
	const [reasoning, setReasoning] = useState(storyObject.reasoning);
	const [acceptanceCriteria, setAcceptanceCriteria] = useState(storyObject.acceptanceCriteria);
	const [storyPoints, setStoryPoints] = useState(storyObject.size);
	const [priority, setPriority] = useState(storyObject.priority)

	const [tempBacklogItemType, setTempBacklogItemType] = useState(backlogItemType);
	const [tempRole, setTempRole] = useState(role);
	const [tempFunctionality, setTempFunctionality] = useState(functionality);
	const [tempReasoning, setTempReasoning] = useState(reasoning);
	const [tempAcceptanceCriteria, setTempAcceptanceCriteria] = useState(acceptanceCriteria);
	const [tempStoryPoints, setTempStoryPoints] = useState(storyPoints);

	const [pokerId, setPokerID] = useState(storyObject.id);
	const [pokerIsOver, setPokerIsOver] = useState(false);
	const [pokerIsOverBuffer, setPokerIsOverBuffer] = useState(false);
	const [userEstimate, setUserEstimate] = useState([1, false]);
	const [teamEstimates, setTeamEstimates] = useState([]);
	const [size, setSize] = useState([]);
	const storyNumber = storyObject.rank + 1;
	const pokerSprintNumber = sprintNumber;
	const [storyNumberBuffer, setStoryNumberBuffer] = useState(storyObject.rank + 1);
	const [pokerSprintNumberBuffer, setPokerSprintNumberBuffer] = useState(sprintNumber);

	const fibonacciNumberEstimates = [0, 1, 2, 3, 5, 8, 13, 21];
	const pokerFibonacciMarks = fibonacciNumberEstimates.map(num => ({ value: num, label: `${num}` }));
	const [sliderValue, setSliderValue] = useState(userEstimate[0])

	const handleMenuClick = (event) => {
		setAnchorOpen(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorOpen(false);
	};

	const handleToggleAcceptanceCriteria = () => {
		setShowAcceptanceCriteria(!showAcceptanceCriteria);
	}

	const handleEditDialogOpen = () => {
		setTempBacklogItemType(backlogItemType)
		setTempRole(role)
		setTempFunctionality(functionality)
		setTempReasoning(reasoning)
		setTempAcceptanceCriteria(acceptanceCriteria)
		setTempStoryPoints(storyPoints)
		setEditDialogOpen(true);
		handleMenuClose();
	};

	const handleEditDialogClose = () => {
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
		handleEditDialogClose();
		handleMenuClose();
	};

	const handlePokerDialogOpen = () => {
		setPokerID(storyObject.id)
		setTempBacklogItemType(backlogItemType);
		setTempRole(role);
		setTempFunctionality(functionality);
		setTempReasoning(reasoning);
		setTempAcceptanceCriteria(acceptanceCriteria);
		setTempStoryPoints(storyPoints);

		setPokerDialogOpen(true);
		handleMenuClose();
	};

	const handlePokerDialogClose = () => {
		setPokerIsOverBuffer(pokerIsOver);
		setPokerSprintNumberBuffer(sprintNumber);
		setStoryNumberBuffer(storyNumber);
		setPokerDialogOpen(false);
	};

	const handlePokerSubmit = () => {
		fetchPlacePosterEstimate();
	};

	const handlePokerNextItem = () => {
		if (!sprints && !backlog) {
			return
		}
		if (sprints) {
			var sprintIndex = pokerSprintNumberBuffer - 1;
			console.log(sprintIndex)
			if (storyNumberBuffer === sprints[sprintIndex].todos.length) {
				return // out of backlog items this sprint
			}
			setTempBacklogItemType(sprints[sprintIndex].todos[storyNumberBuffer].name);
			setTempRole(sprints[sprintIndex].todos[storyNumberBuffer].userTypes);
			setTempFunctionality(sprints[sprintIndex].todos[storyNumberBuffer].functionalityDescription);
			setTempReasoning(sprints[sprintIndex].todos[storyNumberBuffer].reasoning);
			setTempAcceptanceCriteria(sprints[sprintIndex].todos[storyNumberBuffer].acceptanceCriteria);
			setTempStoryPoints(sprints[sprintIndex].todos[storyNumberBuffer].size);
			setPokerID(sprints[sprintIndex].todos[storyNumberBuffer].id);
		} else {
			if (storyNumberBuffer === backlog.length) {
				return // out of backlog items in release backlog
			}
			setTempBacklogItemType(backlog[storyNumberBuffer].name);
			setTempRole(backlog[storyNumberBuffer].userTypes);
			setTempFunctionality(backlog[storyNumberBuffer].functionalityDescription);
			setTempReasoning(backlog[storyNumberBuffer].reasoning);
			setTempAcceptanceCriteria(backlog[storyNumberBuffer].acceptanceCriteria);
			setTempStoryPoints(backlog[storyNumberBuffer].size);
			setPokerID(backlog[storyNumberBuffer].id);
		}
	}

	const handleDeleteDialogOpen = () => {
		handleMenuClose();
		setDeleteDialogOpen(true)
	}

	const handleDeleteDialogClose = () => {
		setDeleteDialogOpen(false)
	}

	const handleDelete = () => {
		handleEditDialogClose();
		console.log(`deleting ${storyObject.id}`)
		deleteFunction(storyObject.id)
	};

	function saveEditedStory(storyId) {
		const newStoryObj = {
			userTypes: tempRole,
			functionalityDescription: tempFunctionality,
			reasoning: tempReasoning,
			acceptanceCriteria: tempAcceptanceCriteria,
			storyPoints: tempStoryPoints,
		}

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
				priority: priority
			}),
		};

		try {
			fetch(
				`http://localhost:8080/api/story/${storyId}/edit`,
				options
			).then((result) => {
				if (sprints) {
					const sprintNumber = sprints.find(sprint => sprint.todos.some(todo => todo.id === storyId))?.sprintNumber;
					setStoryWrapper(newStoryObj, sprintNumber, storyId)
				}
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
		setSprints(sprintsCopy);
	}

	function fetchGetPokerInformation() {
		var options = {
			method: "get",
			credentials: "include",
		};
		try {
			fetch(
				`http://localhost:8080/api/backlogItem/${pokerId}/poker`,
				options
			).then((result) => {
				if (result.status === 200) {
					result.json().then((resultJson) => {
						const {
							pokerIsOver,
							userEstimate,
							othersEstimates,
							rank,
							size,
						} = resultJson;
						setPokerIsOver(pokerIsOver);
						setPokerIsOverBuffer(pokerIsOver);
						setUserEstimate(userEstimate);
						setSliderValue(userEstimate[0] ? userEstimate[0] : 0);
						setTeamEstimates(othersEstimates);
						setStoryNumberBuffer(rank + 1);
						setSize(size);
						setStoryPoints(size);
						setTempStoryPoints(size);
					})
				}
			});
		} catch {
			return null;
		}
	}

	function fetchPlacePosterEstimate() {
		var options = {
			method: "post",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				estimate: sliderValue,
			}),
		};
		try {
			fetch(
				`http://localhost:8080/api/backlogItem/${pokerId}/poker`,
				options
			).then((result) => {
				if (result.status === 200) {
					fetchGetPokerInformation()
				}
			});
		} catch {
			return null;
		}
	}

	useEffect(() => {
		fetchGetPokerInformation();
	}, [pokerId]);

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

					<IconButton
						aria-label="settings"
						aria-controls="menu-userstory"
						aria-haspopup="true"
						onClick={handleToggleAcceptanceCriteria}
						size="large"
						sx={{ position: "absolute", bottom: -1, left: 30 }}
					>
						<NextPlanOutlinedIcon />
					</IconButton>

					<Menu
						id="menu-userstory"
						anchorEl={anchorOpen}
						keepMounted
						open={anchorOpen}
						onClose={handleMenuClose}
					>
						<MenuItem onClick={handleEditDialogOpen}>
							Edit
						</MenuItem>
						<MenuItem onClick={handlePokerDialogOpen}>
							Poker
						</MenuItem>
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
						{storyObject.id}{' '}
						{
							showAcceptanceCriteria ?
								<>
									<Box fontWeight='bold' display='inline'>
										Acceptance Criteria:
									</Box>
									{' '}
									{acceptanceCriteria}
								</>
								:
								`As a(n) ${role} I want to be able to ${functionality} so that ${reasoning}.`
						}
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
				onClose={handleEditDialogClose}
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

					{/* <TextField
						margin="dense"
						id="story-points"
						label="Story Points"
						type="number"
						fullWidth
						variant="outlined"
						value={tempStoryPoints}
						onChange={(e) => setTempStoryPoints(e.target.value)}
						InputProps={{ inputProps: { min: 0 } }}
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
					<Button onClick={handleEditDialogClose}>
						Cancel
					</Button>
					<Button onClick={handleDeleteDialogOpen} color="error">
						Delete
					</Button>
					<Button onClick={handleSave} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={pokerDialogOpen}
				onClose={handlePokerDialogClose}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle >
					<Typography variant="h5" gutterBottom>
						Planning Poker
					</Typography>
					<Divider />
				</DialogTitle>
				<DialogContent>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<Box display="flex" justifyContent="space-between" mb={2}>
								<Typography variant="h6" gutterBottom>
									{storyObject.name}
								</Typography>
								{sprints ?
									<Typography variant="h6" gutterBottom>
										{`Sprint ${pokerSprintNumber} Item ${storyNumberBuffer}`}
									</Typography>
									:
									<Typography variant="h6" gutterBottom>
										{`Product Backlog Item ${storyNumberBuffer}`}
									</Typography>
								}
							</Box>
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

							<Box display="flex" alignItems="center" gap={1} mb={2}>
								<FormControl fullWidth>
									<InputLabel id="priority-select-label">Priority</InputLabel>
									<Select
										labelId="priority-select-label"
										id="demo-simple-select"
										value={priority}
										label="Priority"
										onChange={(event) => { }}
									>
										<MenuItem value={4}>High</MenuItem>
										<MenuItem value={3}>Medium</MenuItem>
										<MenuItem value={2}>Low</MenuItem>
										<MenuItem value={1}>None</MenuItem>
									</Select>
								</FormControl>

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
							</Box>
						</Grid>

						<Grid item xs={0.1}>
							<Divider orientation="vertical" flexItem sx={{ height: "100%", backgroundColor: 'gray', width: "1px" }} />
						</Grid>

						<Grid item xs={5.7} sx={{ position: 'relative' }}>
							<Typography variant="h6" gutterBottom>
								Poker
							</Typography>
							<Divider />
							<ListItem>
								<ListItemIcon>
									<Avatar>You</Avatar>
								</ListItemIcon>
								<ListItemText primary="You" />
								<Grid container alignItems="center" justifyContent="flex-end">
									<Grid item>
										<Box display="flex" alignItems="center" mr={2}>
											<ListItemText
												primary={userEstimate[0]}
												primaryTypographyProps={{ fontSize: 'larger' }}
												sx={{ textAlign: 'right', fontSize: 'large' }}
											/>
										</Box>
									</Grid>
									<Grid item>
										<ListItemIcon sx={{ minWidth: 'unset' }}>
											{userEstimate[1] ? (
												<CheckCircleIcon sx={{ color: 'green' }} fontSize="large" />
											) : (
												<HistoryIcon fontSize="large" />
											)}
										</ListItemIcon>
									</Grid>
								</Grid>
							</ListItem>
							<Divider />
							<Box sx={{ maxHeight: 250, overflowY: 'auto' }}> {/* Set max height and enable overflow */}
								<List fullWidth sx={{ bgcolor: 'background.paper' }}>
									{teamEstimates.map((unsignedUser, index) => (
										<React.Fragment key={index}>
											<ListItem>
												<ListItemIcon>
													<Avatar>TM</Avatar>
												</ListItemIcon>
												<ListItemText primary="Anonymous Teammate" />
												<Grid item>
													<Box display="flex" alignItems="center" mr={2}>
														<ListItemText
															primary={unsignedUser[0]}
															primaryTypographyProps={{ fontSize: 'larger' }}
															sx={{ textAlign: 'right', fontSize: 'large' }}
														/>
													</Box>
												</Grid>
												<Grid item>
													<ListItemIcon sx={{ minWidth: 'unset' }}>
														{unsignedUser[1] ? (
															<CheckCircleIcon sx={{ color: 'green' }} fontSize="large" />
														) : (
															<HistoryIcon fontSize="large" />
														)}
													</ListItemIcon>
												</Grid>
											</ListItem>
											<Divider />
										</React.Fragment>
									))}
								</List>
							</Box>
							<Divider />
							<Box
								sx={{
									position: 'absolute',
									bottom: 0,
									left: 0,
									width: '98%',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'stretch',
									gap: 2,
									padding: '2px 16px',
									backgroundColor: 'transparent',
								}}
							>
								{pokerIsOver && pokerIsOverBuffer ?
									<>
										<Typography variant="h6">
											Poker is complete
										</Typography>
										<Typography component='div'>
											The team agreed on
											{' '}
											<Box fontWeight='bold' display='inline'>
												{size}
											</Box>
											{' '}
											Story Points
										</Typography>
										<Button onClick={() => { setPokerIsOverBuffer(false) }} variant="outlined" sx={{ width: '100%' }}>
											Redo Poker
										</Button>
										<Button onClick={handlePokerNextItem} variant="contained" sx={{ width: '100%' }}>
											Next Item
										</Button>
										<Button onClick={handlePokerDialogClose} variant="outlined" sx={{ width: '100%' }}>
											Done
										</Button>
									</>
									:
									<>
										<Typography variant="h6">
											Make an estimate
										</Typography>
										<Slider
											aria-label="Fibonacci slider"
											key={`slider-${userEstimate[0]}`}
											defaultValue={userEstimate[0]}
											// value={userEstimate[0]}
											getAriaValueText={item => `${item} SP`}
											step={null}
											valueLabelDisplay="auto"
											marks={pokerFibonacciMarks}
											min={0}
											max={21}
											onChangeCommitted={(e, val) => { setSliderValue(val) }}
										/>
										<Button onClick={handlePokerSubmit} variant="contained" sx={{ width: '100%' }}>
											Submit
										</Button>
										<Button onClick={handlePokerNextItem} variant="outlined" sx={{ width: '100%' }}>
											Next Item
										</Button>
										<Button onClick={handlePokerDialogClose} variant="outlined" sx={{ width: '100%' }}>
											Done
										</Button>
									</>
								}
							</Box>

						</Grid>
					</Grid>
				</DialogContent>
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
