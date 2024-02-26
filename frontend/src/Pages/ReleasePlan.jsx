import React, { useState, useEffect, useCallback, Component } from 'react';
import { useLocation } from "react-router-dom"
import { AppBar, Typography, Button, Box, Paper } from '@mui/material';
import { List, ListItem, ListItemText } from '@mui/material';
import CreateReleasePlan from '../Components/CreateReleasePlan'; // Adjust the import path as necessary
import { Grid } from '@mui/material';
import Sidebar from '../Components/Sidebar';
import ButtonGroup from '@mui/material/ButtonGroup';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


/*
This code allows the user to drag and drop the different stories in the release plan. 
*/

// fake data generator
const getItems = (count, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`
  }));

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};


/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});


const ReleasePlan = () => {
  
  //////////////Attributes for DnD/////////////////

  const [state, setState] = useState([getItems(10), getItems(5, 10)]);

  
  {/*const [items, setItems] = useState(getItems(6)); 
    const onDragEnd = useCallback((result) => {
    if (!result.destination) {
      return;
    }

  }, [state]);


  */}

  const onDragEnd = useCallback((result) => {
    const {source, destination} = result;

    if(!destination){
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter(group => group.length));
    }
  });

  
  ////////////////////////////////////////////////
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Grid
      container
      spacing={2}
    >
      <Grid 
        item
        xs={open ? 2 : 'auto'}
      >
        <Sidebar open={open} toggleDrawer={toggleDrawer} />
      </Grid>

      <Grid item xs>
        {/* TODO: update Sprint Number */}
        <Typography
          variant="h6"
          marginTop={8}
          marginBottom={2}
          marginLeft={1}
          textAlign={'left'}
          sx={{
            fontWeight: 'bold',
            fontSize: 32,
          }}
        >
          Sprint 3:
        </Typography>
        <Box
          display="flex"
          justifyContent={'flex-start'}
        >
          <ButtonGroup 
            fullWidth
            variant="contained" 
            sx={{
              margin: '5px 10px',
              height: '60px',
            }}
          >
            {/* TODO: Handle button clicks */}
            <Button
              onClick={() => console.log('Clicked Sprint Plan')}
            >
              <Typography
                fontWeight="bold"
              >
                Sprint Plan
              </Typography>
              
            </Button>

            <Button
              onClick={() => console.log('Clicked Scrum Board')}
            >
              <Typography
                fontWeight="bold"
              >
                Scrum Board
              </Typography>
            </Button>

            <Button
              onClick={() => console.log('Clicked Burnup Chart')}
            >
              <Typography
                fontWeight="bold"
              >
                Burnup Chart
              </Typography>
            </Button>

            <Button
              onClick={() => console.log('Clicked All Sprints')}
            >
              <Typography
                fontWeight="bold"
              >
                All Sprints
              </Typography>
            </Button>
          </ButtonGroup>
        </Box>
        
        <Divider 
          sx={{
            margin: '20px 0px', 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            height: '1.5px'
          }}
        />

        <Typography
          variant="h6"
          marginBottom={2}
          marginLeft={1}
          textAlign={'left'}
          fontWeight="bold"
          fontSize={32}
        >
          Release Plan:
        </Typography>

        {/* TODO: Change version number */}
        <Typography
          textAlign="left"
          marginLeft={2}
          marginBottom={2}
        >
          v1.0.0
        </Typography>
        

        {/* Problem Statement */}
        <Typography
          variant="h6"
          marginBottom={2}
          marginLeft={2}
          textAlign={'left'}
          fontWeight="bold"
          fontSize={18}
          
        >
          Problem Statement
        </Typography>

        <Card
          sx={{
            minHeight: 100,
            maxWidth: '95%',
            marginLeft: 2,
            marginBottom: 2,
            backgroundColor: 'lightgray',
            borderRadius: 5,
          }}
        >
          <CardContent>
            <Typography textAlign='left'>
              {/* TODO: Add problem statement */}
              We noticed that there are currently no good websites for Professor Jullig to run CSE 115 on. 
              All the existing ones are lacking in functionality or have high cost.
            </Typography>
          </CardContent>
        </Card>

        {/* High Level Goals */}
        <Typography
          variant="h6"
          marginBottom={2}
          marginLeft={2}
          textAlign={'left'}
          fontWeight="bold"
          fontSize={18}
        >
          High Level Goals
        </Typography>

        <Card
          sx={{
            minHeight: 100,
            maxWidth: '95%',
            marginLeft: 2,
            marginBottom: 2,
            backgroundColor: 'lightgray',
            borderRadius: 5,
          }}
        >
          <CardContent>
            <Typography textAlign='left'>
              {/* TODO: Add high level goals */}
              In this release, we will implement the ability for students to join their class, join or create projects, create accounts, 
              and be able to reset their password. There will be users of different types and they will be able to interact with one 
              another in real time.
            </Typography>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          <Grid item xs={2.5}>
            <Typography
              variant="h6"
              marginLeft={2}
              textAlign={'left'}
              fontWeight="bold"
              fontSize={24}
              
            >
              Backlog
            </Typography>

            <Paper
              sx={{
                marginLeft: 2,
                backgroundColor: 'lightgray',
                borderRadius: 6,
              }}
            >
              {/* TODO: add Backlog items */}
              <List>
                <ListItem>
                  <Card
                    sx={{
                      marginBottom: 1,
                      borderRadius: 6,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        textAlign={'left'}
                        fontSize={16}
                      >
                        As a student I want to be able to reset my password in case I forget so that 
                        I do not lost access to all my account and data.
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
                <ListItem>
                  <Card
                    sx={{
                      marginBottom: 1,
                      borderRadius: 6,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        textAlign={'left'}
                        fontSize={16}
                      >
                        As a student I want to be able to reset my password in case I forget so that 
                        I do not lost access to all my account and data.
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs>
            <Typography
              variant="h6"
              marginLeft={2}
              textAlign={'left'}
              fontWeight="bold"
              fontSize={24}
              
            >
              Sprints
            </Typography>

            <Paper
              sx={{
                maxWidth: '95%',
                marginLeft: 2,
                backgroundColor: 'lightgray',
                borderRadius: 6,
              }}
            >
              {/* TODO: add Sprints */}
              <List>
                <ListItem>
                  <Card
                    sx={{
                      maxWidth: '25%',
                      marginBottom: 1,
                      borderRadius: 6,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        textAlign={'left'}
                        fontSize={16}
                      >
                        As a student I want to be able to reset my password in case I forget so that 
                        I do not lost access to all my account and data.
                      </Typography>
                    </CardContent>
                  </Card>
                </ListItem>
                {/*Test the drag/drop feature here*/}                    
              </List>
            </Paper>
          </Grid>

        </Grid>

      </Grid>
    </Grid>

    


    
  );
};

export default ReleasePlan;
