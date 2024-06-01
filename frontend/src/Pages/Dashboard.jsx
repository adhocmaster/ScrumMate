import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ButtonBar from '../Components/ReleasePlan/ButtonBar';
import { useState, useEffect } from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import { projectRowDataAPI } from '../API/project';
import { getUserIdAPI } from '../API/user'
import ProjectCreateButton from '../Components/Dashboard/ProjectCreateButton';
import ProjectNotificationsButton from '../Components/Dashboard/ProjectNotificationsButton';
import ProjectShareButton from '../Components/Dashboard/ProjectShareButton';
import ProjectRenameButton from '../Components/Dashboard/ProjectRenameButton';
import ProjectDeleteButton from '../Components/Dashboard/ProjectDeleteButton';

export default function Dashboard({ setName, setSelectedProjectId }) {
	const [rows, setRows] = useState([]);
	const [ownUserId, setOwnUserId] = useState(null);

	function fetchProjectRowData() {
		projectRowDataAPI(setRows);
	}

	useEffect(() => {
		fetchProjectRowData();
	}, []);

	function fetchUserId() {
		getUserIdAPI(setOwnUserId);
	}

	useEffect(() => {
		fetchUserId();
	}, []);

	function Row(projectData) {
		const [open, setOpen] = useState(false);
		const data = projectData.row
		// https://forum.freecodecamp.org/t/how-to-convert-date-to-dd-mm-yyyy-in-react/431093
		const options = { year: 'numeric', month: 'long', day: 'numeric' };
		const formattedDate = new Date(data.dateCreated).toLocaleDateString('en-US', options);

		return (
			<React.Fragment>
				<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
					<TableCell component="th" scope="row">
						<Button
							component={Link}
							to="/releases"
							style={{ textTransform: 'none' }}
							state={{ data }}
							onClick={() => {
								setName(data.name);
								setSelectedProjectId(data.id);
							}}
						>
							{data.name}
						</Button>
					</TableCell>
					<TableCell align="right">{data.productOwner.username}</TableCell>
					<TableCell align="right">{data.numRevisions}</TableCell>
					{/* <TableCell align="right">{data.currentSprint}</TableCell> */}
					<TableCell align="right">{'-'}</TableCell>
					<TableCell align="right">{formattedDate}</TableCell>
					<TableCell align="right">
						<IconButton
							aria-label="expand row"
							size="small"
							onClick={() => setOpen(!open)}
						>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
						<Collapse in={open} timeout="auto" unmountOnExit>
							<Box sx={{ margin: 1 }}>
								<Box display="flex" justifyContent="space-between" alignItems="center">
									<Typography variant="h6" gutterBottom component="div">
										Shortcuts
									</Typography>
									<ListItemIcon>
										<ProjectShareButton id={data.id} ownUserId={ownUserId} />
										<ProjectRenameButton rows={rows} setRows={setRows} name={data.name} id={data.id} />
										<ProjectDeleteButton rows={rows} setRows={setRows} name={data.name} id={data.id} />
									</ListItemIcon>
								</Box>
								<Box
									display="flex"
									justifyContent={'flex-start'}
								>
									{/* TODO: Handle Button Clicks */}
									<ButtonBar />
								</Box>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			</ React.Fragment >
		);
	}

	return (
		<>
			<Box sx={{
				display: 'flex',
				paddingLeft: '20px',
				paddingBottom: '20px',
				paddingTop: '55px'
			}}>
				<Typography
					variant="h4"
					align='left'
					sx={{ flexGrow: 0 }}
				>
					My Projects
				</Typography>
				<ProjectCreateButton rows={rows} setRows={setRows} />
				<ProjectNotificationsButton rows={rows} setRows={setRows} />
			</Box>

			<TableContainer component={Paper} sx={{ width: '90%', margin: 'auto' }}>
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<TableCell>
								<Typography variant="h5">
									Project Name
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="h5">
									Owner
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="h5">
									Revision Number
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="h5">
									Current Sprint
								</Typography>
							</TableCell>
							<TableCell align="right">
								<Typography variant="h5">
									Date Created
								</Typography>
							</TableCell>
							<TableCell />
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<Row key={row.id} row={row} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
}
