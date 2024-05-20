import React, { useState, useEffect, useRef } from "react";
import { Typography, Box, TextField } from "@mui/material";
import { Grid, Divider } from "@mui/material";
import { IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Sidebar from "../Components/ReleasePlan/Sidebar";
import ButtonBar from "../Components/ReleasePlan/ButtonBar";
import ContentBox from "../Components/common/ContentBox";
import DragList from "../Components/ReleasePlan/DragList";
import Backlog from "../Components/ReleasePlan/Backlog";
import SanityCheckGraph from "../Components/ReleasePlan/SanityCheckGraph";
import SanityCheckText from "../Components/ReleasePlan/SanityCheckText";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';


const ReleasePlan = ({ projectId }) => {
	const [sprints, setSprints] = useState([]);
	const [open, setOpen] = useState(true);
	const [problemStatement, setProblem] = useState("");
	const [highLevelGoals, setGoals] = useState("");
	const [releaseId, setId] = useState(null);
	const [lockPage, setLockPage] = useState(false);

	const handleChangeHighLevelGoals = (event) => {
		setGoals(event.target.value);
	}

	function fetchMostRecentRelease() {
		var options = {
			method: "get",
			credentials: "include",
		};
		try {
			fetch(
				`http://localhost:8080/api/project/${projectId}/recentRelease`,
				options
			).then((result) => {
				if (result.status === 200) {
					result.json().then((response) => {
						setId(response.id);
					});
				}
			});
		} catch { }
	}

	function fetchRelease(releaseId, setProblem, setGoals) {
		console.log("about to fetch a release");
		var options = {
			method: "get",
			credentials: "include",
		};
		try {
			fetch(`http://localhost:8080/api/release/${releaseId}`, options).then(
				(result) => {
					if (result.status === 200) {
						result.json().then((response) => {
							setProblem(response.problemStatement);
							setGoals(response.goalStatement);
						});
					}
				}
			);
		} catch { }
	}

	function fetchSprints(releaseId) {
		var options = {
			method: "get",
			credentials: "include",
		};
		try {
			fetch(
				`http://localhost:8080/api/release/${releaseId}/sprints`,
				options
			).then((result) => {
				if (result.status === 200) {
					result.json().then((response) => {
						setSprints(response);
					});
				} else {
					setSprints([]);
				}
			});
		} catch { }
	}

	// updates the problem statement
	function editProblemStatement(e) {
		var options = {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ problemStatement: e.target.value },
				{ goalStatement: e.target.value }),
		};
		fetch(`http://localhost:8080/api/release/${releaseId}/edit`, options)
			.then((result) => {
				if (result.status === 200) {
					result.json().then((response) => {
						setProblem(response.problemStatement);
					});
				}
			})
	}

	// updates the HighLevelGoals
	function editGoals(e) {
		var options = {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ goalStatement: e.target.value }),
		};
		fetch(`http://localhost:8080/api/release/${releaseId}/edit`, options)
			.then((result) => {
				if (result.status === 200) {
					result.json().then((response) => {
						setGoals(response.goalStatement);
					});
				}
			})
	}

	function createNewSprints() {
		console.log("creating new");
		var options = {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ sprintNumber: sprints.length + 1 }),
		};

		fetch(`http://localhost:8080/api/release/${releaseId}/sprint`, options)
			.then((result) => {
				if (result.status === 200) {
					console.log(result);
				}
				console.log(result);
				return result.json();
			})
			.then((response) => {
				console.log(response);
				setSprints((prevSprints) => [...prevSprints, response]);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	useEffect(() => {
		fetchMostRecentRelease();
	}, []);

	useEffect(() => {
		fetchRelease(releaseId, setProblem, setGoals);
		fetchSprints(releaseId);
	}, [releaseId]);

	const toggleDrawer = () => {
		setOpen(!open);
	};

	const revisionsClick = (newReleaseId) => {
		setId(newReleaseId);
	};
	return (


		< Grid container spacing={2} >
			{/* Revision Sidebar */}
			< Grid item xs={open ? 2 : "auto"} >
				<Sidebar
					open={open}
					toggleDrawer={toggleDrawer}
					projectId={projectId}
					itemClick={revisionsClick}
					currentReleaseId={releaseId}
					setLockPage={setLockPage}
				/>
			</Grid >
			<Grid item xs={open ? 10 : 11}>
				{/* Current Sprint */}
				{/* TODO: update Sprint Number */}
				<Typography
					variant="h6"
					marginTop={8}
					marginBottom={2}
					marginLeft={1}
					textAlign={"left"}
					sx={{
						fontWeight: "bold",
					}}
				>
					Current Sprint (#3):
				</Typography>

				<Box display="flex" justifyContent={"flex-start"}>
					{/* TODO: Handle Button Clicks */}
					<ButtonBar />
				</Box>

				<Divider
					sx={{
						margin: "20px 0px",
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						height: "1.5px",
					}}
				/>

				<Typography
					marginBottom={2}
					marginLeft={1}
					textAlign={"left"}
					fontWeight="bold"
					fontSize={14}
				>
					Release Plan:
				</Typography>

				{/* TODO: Change version number */}
				<Typography
					textAlign="left"
					marginLeft={2}
					marginBottom={2}
					fontSize={14}
				>
					v1.0.0
				</Typography>

				{/* Problem Statement */}
				<Typography
					variant='body1'
					marginBottom={2}
					marginLeft={2}
					textAlign={'left'}
					fontWeight="bold"
					fontSize={14}
				>
					Problem Statement
				</Typography>
				{lockPage ?
					< ContentBox title={"Problem Statement"} content={problemStatement} />
					:
					<TextField
						sx={{
							margin: '5px 10px',
							height: "130px",
						}}
						minRows={4}
						maxRows={4}
						style={{ width: "98%" }}
						value={problemStatement}
						onChange={editProblemStatement}
						multiline

					/>}
				<Typography
					variant='body1'
					marginBottom={2}
					marginLeft={2}
					textAlign={'left'}
					fontWeight="bold"
					fontSize={14}
				>
					High Level Goals
				</Typography>
				{lockPage ?
					<ContentBox content={highLevelGoals} />
					:
					<TextField
						sx={{
							margin: '5px 10px',
							height: "130px",
						}}
						minRows={4}
						maxRows={4}
						style={{ width: "98%" }}
						value={highLevelGoals}
						onChange={editGoals}
						multiline
					/>}



				<Grid container spacing={2}>
					{/* Sprints */}
					<Grid item xs={9}>
						<Typography
							marginLeft={4}
							maxRows={4}
							textAlign="left"
							fontWeight="bold"
							fontSize={14}
						>
							Sprints
							<IconButton
								sx={{
									marginBottom: "3px",
								}}
								onClick={createNewSprints}
							>
								<AddCircleOutlineIcon fontSize="small" />
							</IconButton>
						</Typography>
						<DragList
							marginLeft={2}
							items={sprints}
							setItems={setSprints}
							releaseId={releaseId}
						/>
						{/* {sprints != [] ? <DragList items={sprints} setItems={setSprints}/>: ''} */}
					</Grid>
					{/* Backlog */}
					<Grid item xs={3}>
						<Backlog releaseId={releaseId} />
					</Grid>
				</Grid>
				{/* Sanity Check */}
				<Typography
					variant="h5"
					fontWeight="bold"
					gutterBottom
					fontSize={14}
					textAlign="left"
					marginLeft={2}
					marginTop={2}
				>
					Sanity Check
				</Typography>

				<Grid container spacing={2}>
					{/* Sanity Check Graph */}
					<Grid item xs={6}>
						<SanityCheckGraph sprints={sprints} />
					</Grid>
					<Grid item xs={6}>
						<SanityCheckText
							text={
								"Yes we can do it because no sprint looks like too much work. Lorem ipsum dolor sit amet …"
							}
						/>
					</Grid>
				</Grid>
			</Grid>
		</Grid >
	);
};

export default ReleasePlan;
