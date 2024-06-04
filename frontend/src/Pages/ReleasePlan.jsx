import React, { useState, useEffect } from "react";
import { Typography, Box, TextField } from "@mui/material";
import { Grid, Divider } from "@mui/material";
import Sidebar from "../Components/ReleasePlan/Sidebar";
import ButtonBar from "../Components/ReleasePlan/ButtonBar";
import ContentBox from "../Components/common/ContentBox";
import SanityCheckGraph from "../Components/ReleasePlan/SanityCheckGraph";
import Board from "../Components/ReleasePlan/dragAndDrop/SprintsAndBacklog"
import { mostRecentReleaseAPI } from "../API/project";
import { editReleaseAPI, getReleaseAPI, getSprintsAPI } from "../API/release";
import LockableTextBox from "../Components/ReleasePlan/LockableTextBox";

const ReleasePlan = ({ projectId }) => {
	const [sprints, setSprints] = useState([]);
	const [open, setOpen] = useState(true);
	const [problemStatement, setProblem] = useState("");
	const [highLevelGoals, setGoals] = useState("");
	const [releaseId, setId] = useState(null);
	const [lockPage, setLockPage] = useState(false);

	function fetchMostRecentRelease() {
		const resultSuccessHandler = (response) => {
			setId(response.id);
		}
		mostRecentReleaseAPI(projectId, resultSuccessHandler);
	}

	function fetchRelease(releaseId, setProblem, setGoals) {
		const resultSuccessHandler = (response) => {
			setProblem(response.problemStatement);
			setGoals(response.goalStatement);
		}
		getReleaseAPI(releaseId, resultSuccessHandler);
	}

	function fetchSprints(releaseId) {
		const resultFailureHandler = () => {
			setSprints([]);
		}
		getSprintsAPI(releaseId, setSprints, resultFailureHandler);
	}

	function editProblemStatement(e) {
		setProblem(e.target.value);
		editReleaseAPI(releaseId, e.target.value, null);
	}

	function editGoals(e) {
		setGoals(e.target.value);
		editReleaseAPI(releaseId, null, e.target.value);
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

				{/* <Typography
					textAlign="left"
					marginLeft={2}
					marginBottom={2}
					fontSize={14}
				>
					v1.0.0
				</Typography> */}

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

				<LockableTextBox 
					lockPage={lockPage}
					text={problemStatement} 
					editText={editProblemStatement} 
				/>

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

				<LockableTextBox 
					lockPage={lockPage}
					text={highLevelGoals} 
					editText={editGoals} 
				/>

				<Board sprints={sprints} setSprints={setSprints} releaseId={releaseId} projectId={projectId} lockPage={lockPage} withScrollableColumns />

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
					<Grid item xs={6}>
						<SanityCheckGraph sprints={sprints} />
					</Grid>
					{/* <Grid item xs={6}>
						<SanityCheckText
							text={
								"Yes we can do it because no sprint looks like too much work. Lorem ipsum dolor sit amet …"
							}
						/>
					</Grid> */}
				</Grid>
			</Grid>
		</Grid >
	);
};

export default ReleasePlan;
