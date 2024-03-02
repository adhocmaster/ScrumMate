import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom"
import { Typography, Button, Box, Paper } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import { Grid, Input, Divider, Card, CardContent, IconButton } from '@mui/material';
import Sidebar from '../Components/Sidebar';
import ButtonBar from '../Components/ButtonBar';
import ContentBox from '../Components/ContentBox';
import Sprint from '../Components/Sprint';

const ReleasePlan = () => {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [backlogItems, setBacklogItems] = useState([]);

  const addBacklogItem = () => {
    const newBacklogItems = [...backlogItems, { description: '' }];
    setBacklogItems(newBacklogItems);
  };

  // TODO: update Placeholder functions/variables with actual data
  const sprintPlanClick = () => console.log('Clicked Sprint Plan');
  const scrumBoardClick = () => console.log('Clicked Scrum Board');
  const burnupChartClick = () => console.log('Clicked Burnup Chart');
  const allSprintsClick = () => console.log('Clicked All Sprints');
  const revisionsClick = () => console.log('Revision Placeholder');
  const problemStatement = `We noticed that there are currently no good 
    websites for Professor Jullig to run CSE 115 on. All the existing 
    ones are lacking in functionality or have high cost.`
  const highLevelGoals = `In this release, we will implement the ability 
    for students to join their class, join or create projects, create 
    accounts, and be able to reset their password. There will be users of 
    different types and they will be able to interact with one 
    another in real time.`
  const userStoryText = `As a student I want to be able to reset my password 
    in case I forget so that I do not lost access to all my account and data.`
  const allUserStories = [userStoryText, userStoryText, problemStatement, highLevelGoals, 
    highLevelGoals, problemStatement, "add testing", userStoryText];	
		
  return (
    <Grid container spacing={2}>
      {/* Revision Sidebar */}
      <Grid item xs={open ? 2 : 'auto'}>
        {/* TODO: replace the revisions */}
        <Sidebar 
          open={open} 
          toggleDrawer={toggleDrawer} 
          title={'Revisions'}
          items={[]}
          itemClick={revisionsClick}
        />
      </Grid>

      <Grid item xs={open ? 10 : 11}>
        {/* Current Sprint */}
        {/* TODO: update Sprint Number */}
        <Typography
          variant="h6"
          marginTop={8}
          marginBottom={2}
          marginLeft={1}
          textAlign={'left'}
          sx={{
            fontWeight: 'bold',
          }}
        >
          Current Sprint (#3):
        </Typography>

        <Box
          display="flex"
          justifyContent={'flex-start'}
        >
          {/* Handle Button Clicks */}
          <ButtonBar 
            text1={'Sprint Plan'}
            text2={'Scrum Board'}
            text3={'Burnup Chart'}
            text4={'All Sprints'}
            text1Click={sprintPlanClick}
            text2Click={scrumBoardClick}
            text3Click={burnupChartClick}
            text4Click={allSprintsClick}
          />
        </Box>
        
        <Divider 
          sx={{
            margin: '20px 0px', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            height: '1.5px'
          }}
        />

        <Typography
          marginBottom={2}
          marginLeft={1}
          textAlign={'left'}
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
        {/* TODO: replace problem statement */}
        <ContentBox title={'Problem Statement'} content={problemStatement} />

        {/* High Level Goals */}
        {/* TODO: high level goals */}
        <ContentBox title={'High Level Goals'} content={highLevelGoals} />
        
        <Grid container spacing={2}>
          {/* Sprints */}
          <Grid item xs={9}>
            <Typography
              marginLeft={2}
              textAlign="left"
              fontWeight="bold"
              fontSize={14}
            >
              Sprints
            </Typography>

            <Sprint userStories={allUserStories} />
            <Sprint userStories={allUserStories.reverse()} />
          </Grid>

          <Grid item xs={3}>
            <Typography
              variant="h6"
              marginLeft={2}
              textAlign={'left'}
              fontWeight="bold"
              fontSize={14}
            >
              Backlog
            </Typography>

            <Paper
              sx={{
                maxWidth: '90%',
                marginLeft: 2,
                backgroundColor: 'lightgray',
              }}
            >
              <List>
                {backlogItems.map((item, index) => (
                  <ListItem key={index}>
                    <Card
                      sx={{
                        marginBottom: 1,
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="body1"
                          fontSize={14}
                        >
                          <Input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const newBacklogItems = [...backlogItems];
                              newBacklogItems[index].description = e.target.value;
                              setBacklogItems(newBacklogItems);
                            }}
                            placeholder="Enter backlog item"
                            style={{ border: 'none', width: '100%', padding: '4px' }}
                          />
                        </Typography>
                      </CardContent>
                    </Card>
                  </ListItem>
                ))}
              </List>
              {/* Button to add new backlog item */}
              <Button
                variant="contained"
                onClick={addBacklogItem}
                sx={{bgcolor: 'grey',
                    '&:hover': {
                      bgcolor: 'darkgrey', // Background color on hover
                    },
                  }}
                >
                Add Backlog Item +
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ReleasePlan;
