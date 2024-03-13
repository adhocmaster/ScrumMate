// import { useState } from 'react';
import { Box, Divider, Typography, Paper, List, ListItem } from '@mui/material';
import UserStory from './UserStory';
import DeleteConfirmation from './DeleteConfirmation';


const Sprint = ({index, items, setItems, userStories}) => {
  const deleteSprint = (sprintId, index) => {
		fetch(`http://localhost:8080/api/sprint/${sprintId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json'
      },
    })
		.catch(error => {
			console.log('error deleting sprint:');
		});	

    const updatedSprints = items.filter((_, i) => index !== i);
    setItems(updatedSprints);
  };


const Sprint = ({userStories, sprintValue}) => {
  return (
    <>
      <Box 
        sx={{
          display: 'flex',
          marginLeft: 2,
          marginBottom: 2,
          backgroundColor: 'lightgray',
        }}
      >
        <Box
          sx={{
            display: 'flex', 
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {/* Sprint Sidebar */}
          <Box 
            sx={{
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              height: '100%',
              marginLeft: 2,
            }}
          >
            {/* Sprint Number */}
            <Typography sx={{marginTop: 2}} fontSize={14}>
              {sprintValue}
            </Typography>
            
            {/* TODO: handle button click/drag */}
            {/* Not sure if we still need */}
            {/* <IconButton onClick={() => console.log(`Clicked Sprint Menu Icon`)}>
              <MenuIcon fontSize='medium'/>
            </IconButton> */}

            {/* Delete Sprint Icon w/ Confirmation Menu*/}
            <DeleteConfirmation 
              onDelete={() => {
                const sprintId = items[index].id;
                deleteSprint(sprintId, index);
              }} 
            />

            {/* Total Story Points */}
            {/* TODO: replace with total number of story points */}
            <Typography sx={{marginBottom: 2}} fontSize={14}>
              8
            </Typography>
          </Box>

          {/* Divider */}
          <Box sx={{height: '100%'}}>
            <Divider 
              orientation='vertical'
              sx={{
                marginTop: '16px',
                marginLeft: '12px', 
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                width: '1.5px',
                height: '88%'
              }}
            />
          </Box>
        </Box>
        
        {/* User Stories */}
        <Paper
          sx={{
            backgroundColor: 'lightgray',
            overflowX: 'auto', 
          }}
        >
          <List sx={{display: 'flex'}}>
            {userStories && userStories.map((userStory, index) => (
              <ListItem 
                key={index} 
                sx={{
                  minWidth: 200, 
                  display: 'inline-block', 
                  padding: '8px 0px 8px 12px',
                }}
              >
                <UserStory userStoryText={userStory.functionalityDescription} storyPoints={userStory.storyPoints}/>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </>
  );
};

export default Sprint;
	
