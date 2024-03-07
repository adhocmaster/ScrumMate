// import { useState } from 'react';
import { Box, Divider, IconButton, Typography, Paper, List, ListItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UserStory from './UserStory';

const Sprint = ({index, items, setItems, userStories, sprintNumber}) => {
  // console.log(items);
  // const [sprintNumberState, setSprintNumberState] = useState(sprintNumber);

  async function updateSprint(sprintId) {
    console.log(sprintId);
		await fetch(`http://localhost:8080/api/sprint/${sprintId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
          'Content-Type': 'application/json'
      },
    })
		.then(response => response.json())
		.then(data => {
			console.log(data);
			setItems(data);
		})
		.catch(error => {
			
		});	
	}

  // const deleteSprint = (sprintIndex) => {
  //   const newSprints = items.filter((_, index) => index !== sprintIndex);
  //   setItems(newSprints);
  // };

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
            <Typography sx={{marginTop: 2}} fontSize={14}>
              {sprintNumber}
            </Typography>
            
            {/* TODO: handle button click/drag */}
            <IconButton onClick={() => console.log(`${JSON.stringify(items[index])}`)}>
              <MenuIcon fontSize='medium'/>
            </IconButton>

            <IconButton 
              onClick={() => {
                // deleteSprint(index);
                updateSprint(items[index].id);
              }}
            >
              <DeleteOutlineIcon fontSize='medium'/>
            </IconButton>

            {/* TODO: replace with total number of story points */}
            <Typography sx={{marginBottom: 2}} fontSize={14}>
              8
            </Typography>
          </Box>
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
            {/* TODO: add Sprint's User Stories */}
            {userStories.map((userStory, index) => (
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
