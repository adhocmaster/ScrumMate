import { useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Button, Drawer, Icon, IconButton, Typography } from "@mui/material";
import { List, ListItem, ListItemButton } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

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

	const addRevisions = (item) => {
		setRevisions([...revisions, item]);
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
				<Typography
					variant='body'
					sx={{
						marginLeft: 9,
						fontWeight: 'bold',
						fontSize: 24,
					}}
				>
					{title}
				</Typography>
			}

			{open ? 
				<IconButton 
					onClick={toggleDrawer}
					sx={{ 
						marginLeft: 'auto',
					}}
				>
					<ChevronLeftIcon />
				</IconButton> 
				:
				<IconButton 
					onClick={toggleDrawer}
					sx={{ 
						marginLeft: 'auto',
					}}
				>
					<ChevronRightIcon />
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
						{locked ? <LockIcon /> : <LockOpenIcon />}
					</IconButton>

					<Typography
						fontSize={16}
						sx={{ margin: 'left' }}
					>
						{revisionDate}
					</Typography>
					
					<IconButton 
						onClick={console.log("temp")}
						sx={{ 
							marginLeft: 'auto',
						}}
						>
						<ContentCopyIcon />
					</IconButton>
					{/* <Button endIcon={<Button onClick={console.log("temp")}><EditIcon /></Button>}/> */}
				</ListItemButton>
			))}
		</List>
		</Drawer>
	);
}

export default Sidebar;
