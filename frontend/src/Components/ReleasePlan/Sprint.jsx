import { useState } from 'react';
import { Box, Divider, Typography, Paper, List } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import UserStory from './UserStory';
import DeleteConfirmation from './DeleteConfirmation';
import { useAgile } from './AgileProvider';

const Sprint = ({ index, items, setItems, userStories }) => {
	const { stories = [], setStories, onDragEnd } = useAgile();

	const deleteSprint = (sprintId, index) => {
		fetch(`http://localhost:8080/api/sprint/${sprintId}`, {
			method: 'DELETE',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
		})
			.catch(error => console.log('error deleting sprint:'));
		const updatedSprints = items.filter((_, i) => index !== i);
		setItems(updatedSprints);
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Box sx={{ display: 'flex', marginLeft: 2, marginBottom: 2, backgroundColor: 'lightgray' }}>
				<Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '100%', marginLeft: 2 }}>
						<Typography sx={{ marginTop: 2 }} fontSize={14}>{index + 1}</Typography>
						<DeleteConfirmation onDelete={() => { const sprintId = items[index].id; deleteSprint(sprintId, index); }} />
						<Typography sx={{ marginBottom: 2 }} fontSize={14}>8</Typography>
					</Box>
					<Box sx={{ height: '100%' }}>
						<Divider orientation='vertical' sx={{ marginTop: '10px', marginLeft: '12px', backgroundColor: 'rgba(0, 0, 0, 0.5)', width: '1.5px', height: '88%' }} />
					</Box>
				</Box>
				<Droppable droppableId={`userstoryDroppable-${index}`} direction="horizontal">
					{(provided) => (
						<Paper sx={{ backgroundColor: 'lightgray', overflowX: 'auto' }}>
							<List ref={provided.innerRef} {...provided.droppableProps} sx={{ display: 'flex', flexDirection: 'row' }}>
								{stories.map((story, idx) => (
									<Draggable key={story.id} draggableId={story.id.toString()} index={idx}>
										{(provided) => (
											<div
												ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
												onClick={(event) => event.stopPropagation()}
												sx={{ minWidth: 200, display: 'inline-block', padding: '8px 0px 8px 12px' }}>
												<UserStory key={story.id} userStoryText={story.description} storyPoints={story.storyPoints} 
												onClick={(event) => event.stopPropagation()} 
												/>
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</List>
						</Paper>
					)}
				</Droppable>
			</Box>
		</DragDropContext >
	);
};

export default Sprint;
