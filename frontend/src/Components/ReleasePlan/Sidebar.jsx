import { useState, useEffect  } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Drawer, IconButton, Typography, Grid } from "@mui/material";
import { List, ListItem, ListItemButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Sidebar = ({ open, toggleDrawer, title, items, itemClick }) => {
	const [selected, setSelected] = useState(0);

	function convertRevisionAndDate(release) {
		release.revision = `Revision ${release.revision}`
		release.revisionDate = new Date(release.revisionDate).toLocaleString().split(',')[0]
		return release
	}
	
	function fetchReleases(projectId, setRevisions) {
		console.log("about to fetch")
		var options = {
			method:'get',
			credentials:'include'
		  }
		fetch(`http://localhost:8080/api/project/${projectId}/releases`, options).then((result)=>{
			if(result.status === 200){
				console.log(result)
			}
			result.json().then((response)=>{
				console.log(response)
				setRevisions(response.releases.map((release) => convertRevisionAndDate(release)))
			})
		})
	}
	
	function createNewRelease(projectId, addRevisions) {
		try {
			const options = {
				method: 'POST',
				credentials: 'include',
			};
			fetch(`http://localhost:8080/api/project/${projectId}/release`, options).then((result)=>{
				if(result.status === 200){
					console.log(result)
				}
				result.json().then((response)=>{
					addRevisions(response);
					itemClick(response.id)
				})
			})
		} catch (error) {
			console.error(error);
			return null; // Return null or handle the error as needed
		}
	}
	
	function copyRelease(releaseId, addRevisions) {
		try {
			console.log("about to copy");
			const options = {
				method: 'POST',
				credentials: 'include',
			};
			fetch(`http://localhost:8080/api/release/${releaseId}/copy`, options).then((result)=>{
				if(result.status === 200){
					console.log(result)
				}
				result.json().then((response)=>{
					console.log(response)
					addRevisions(response);
					itemClick(response.id)
				})
			})
		} catch (error) {
			console.error(error);
			return null; // Return null or handle the error as needed
		}
	}
	
	const [revisions, setRevisions] = useState(items || []);

	useEffect(() => {
		fetchReleases(1, setRevisions);
	}, []);

	const toggleLock = (index) => {
		setRevisions(prevRevisions => {
			// Create a copy of the revisions array
			const newRevisions = [...prevRevisions];
			// Toggle the locked state of the specified revision
			newRevisions[index] = {
				...newRevisions[index], // Copy the existing properties
				locked: !newRevisions[index].locked // Update the locked state
			};
			return newRevisions; // Return the updated array
		});
	}

	const addRevisions = (item) => {
		setRevisions([convertRevisionAndDate(item), ...revisions]);
	};
	
	const removeRevisions = (index) => {
		const newRevisionArray = revisions.filter((_, i) => i !== index);
		setRevisions(newRevisionArray);
	};
	
	return (
		<Drawer
			open={true}
			variant="persistent"
			anchor="left"
			sx={{
				height: 16,
				width: open ? 250 : 40,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					marginTop: 10,
					width: open ? 250 : 40,
					boxSizing: 'border-box',
				},
			}}
		>

		<List>
			<ListItem disablePadding>
				{open &&
				<>
					<Typography
						variant='body'
						sx={{
							marginLeft: 2,
							fontWeight: 'bold',
							fontSize: 14,
						}}
					>
						{title}					
					</Typography>
				
					<Grid container justifyContent="flex-end">
						<Grid item>
							{/* Add new blank revision */}
							<IconButton
								onClick={() => {
									createNewRelease(1, addRevisions);
									setSelected(0); 
								}}
							>
								<AddCircleOutlineIcon fontSize="small"/>
							</IconButton>
						</Grid>
					</Grid>
				</>
			}

			{open ? 
				<IconButton 
					onClick={toggleDrawer}
					sx={{ 
						marginLeft: 'auto',
					}}
				>
					<ChevronLeftIcon fontSize="small"/>
				</IconButton> 
				:
				<IconButton 
					onClick={toggleDrawer}
					sx={{ 
						marginLeft: 'auto',
					}}
				>
					<ChevronRightIcon fontSize="small"/>
				</IconButton>
			}
			</ListItem>

			{open && revisions.map(({id, revision, revisionDate, locked}, index) => (
				<ListItemButton
					onClick={() => {
						itemClick(id);
						setSelected(index);
					}}
					key={index}
					sx={{backgroundColor: selected === index ? 'lightgray' : 'white',}}
				>
					<IconButton 
						onClick={(e) => {
							e.stopPropagation();
							toggleLock(index);
						}}
						sx={{ 
							marginRight: 'auto',
						}}
					>
						{locked ? <LockIcon fontSize="small"/> : <LockOpenIcon fontSize="small"/>}
					</IconButton>

					<Typography fontSize={14}>
						{`${revision} ${revisionDate}`}
					</Typography>
					
					<IconButton 
						onClick={(e) => {
							e.stopPropagation();
							copyRelease(id, addRevisions);
							setSelected(0); 
						}}
						sx={{ 
							marginLeft: 'auto',
						}}
						>
						<ContentCopyIcon fontSize="small"/>
					</IconButton>
				</ListItemButton>
			))}
		</List>
		</Drawer>
	);
}

export default Sidebar;
