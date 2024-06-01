import React, { useEffect, useState } from "react";
import {
	Box, Dialog, DialogTitle, DialogContent, Button, TextField, Grid, Divider, List, ListItem, ListItemIcon, Avatar, ListItemText, Typography, Slider
} from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { InputLabel, Select, MenuItem, FormControl } from '@mui/material';
import { getPokerInformationAPI, placePokerEstimateAPI } from "../../API/backlogItem";

export default function PokerMenu({
	storyObject,
	sprintNumber,
	handleMenuClose,
	sprints,
	backlog,
	setSprints,
	setBacklog,

	setTempBacklogItemType,
	setTempRole,
	setTempFunctionality,
	setTempReasoning,
	setTempAcceptanceCriteria,
	setTempStoryPoints,

	tempRole,
	tempFunctionality,
	tempReasoning,
	tempAcceptanceCriteria,
	tempStoryPoints,
	tempPriority,

	backlogItemType,
	role,
	functionality,
	reasoning,
	acceptanceCriteria,
	storyPoints,
}) {
	const [pokerDialogOpen, setPokerDialogOpen] = useState(false);

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

	function fetchGetPokerInformation() {
		const resultSuccessHandler = (response) => {
			const {
				pokerIsOver,
				userEstimate,
				othersEstimates,
				rank,
				size,
			} = response;
			setPokerIsOver(pokerIsOver);
			setPokerIsOverBuffer(pokerIsOver);
			setUserEstimate(userEstimate);
			setSliderValue(userEstimate[0] ? userEstimate[0] : 0);
			setTeamEstimates(othersEstimates);
			setStoryNumberBuffer(rank + 1);
			setSize(size);
			setTempStoryPoints(size);
			if (sprints) {
				const sprintsCopy = [...sprints];
				sprintsCopy[sprintNumber - 1].todos[rank].size = size;
				setSprints(sprintsCopy);
			} else {
				const backlogCopy = [...backlog];
				backlogCopy[rank].size = size;
				setBacklog(backlogCopy);
			}
		}
		getPokerInformationAPI(pokerId, resultSuccessHandler);
	}

	function fetchPlacePosterEstimate() {
		placePokerEstimateAPI(pokerId, sliderValue, fetchGetPokerInformation);
	}

	useEffect(() => {
		fetchGetPokerInformation();
	}, [pokerId]);

	return <>
		<MenuItem onClick={handlePokerDialogOpen}>Poker</MenuItem>

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
								disabled
								size="small"
								label="Role"
								value={tempRole}
								onChange={(e) => setTempRole(e.target.value)}
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
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
							disabled
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
							sx={{
								marginBottom: 2,
								"& .MuiInputBase-input.Mui-disabled": {
									WebkitTextFillColor: "#000000",
								},
							}}
						/>

						<Typography variant="body2" component="span" >
							so that
						</Typography>

						<TextField
							disabled
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
							sx={{
								marginBottom: 2,
								marginTop: 2,
								"& .MuiInputBase-input.Mui-disabled": {
									WebkitTextFillColor: "#000000",
								},
							}}
						/>

						<TextField
							disabled
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
							sx={{
								marginBottom: 2,
								"& .MuiInputBase-input.Mui-disabled": {
									WebkitTextFillColor: "#000000",
								},
							}}
						/>

						<Box display="flex" alignItems="center" gap={1} mb={2}>
							<FormControl fullWidth disabled sx={{
								"& .MuiInputBase-input.Mui-disabled": {
									WebkitTextFillColor: "#000000",
								},
							}}>
								<InputLabel id="priority-select-label">Priority</InputLabel>
								<Select
									labelId="priority-select-label"
									id="demo-simple-select"
									value={tempPriority}
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
								disabled
								margin="dense"
								id="story-points"
								label="Story Points"
								type="number"
								fullWidth
								variant="outlined"
								value={tempStoryPoints}
								onChange={(e) => setTempStoryPoints(e.target.value)}
								InputProps={{ inputProps: { min: 0 } }}
								sx={{
									"& .MuiInputBase-input.Mui-disabled": {
										WebkitTextFillColor: "#000000",
									},
								}}
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
	</>
}