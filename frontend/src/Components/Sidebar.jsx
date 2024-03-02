import { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button, Drawer, Icon, IconButton, Typography, Grid } from "@mui/material";
import { List, ListItem, ListItemButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Sidebar = ({ open, toggleDrawer, title, items, itemClick }) => {
	const [revisions, setRevisions] = useState(items);
	
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

	const addRevisions = () => {
		const item = {revisionDate: "Revision x 2/29/24", locked: false}
		setRevisions([item, ...revisions]);
	};

	const copyRevision = (index) => {
    	setRevisions([{revisionDate: revisions[index].revisionDate, locked: false}, ...revisions]);
	}
	
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
			}
		
			{open &&
				<Grid container justifyContent="flex-end">
					<Grid item>
						<IconButton 
							onClick={addRevisions}
						>
							<AddCircleOutlineIcon fontSize="small"/>
						</IconButton>
					</Grid>
				</Grid>
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

			{open && revisions.map(({revisionDate, locked}, index) => (
				<ListItemButton
					onClick={itemClick}
					key={index}
				>
					<IconButton 
						onClick={() => toggleLock(index)}
						sx={{ 
							marginRight: 'auto',
						}}
					>
						{locked ? <LockIcon fontSize="small"/> : <LockOpenIcon fontSize="small"/>}
					</IconButton>

					<Typography fontSize={14}>
						{revisionDate}
					</Typography>
					
					<IconButton 
						onClick={() => {copyRevision(index)}}
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
